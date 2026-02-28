import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromRequest, successResponse, errorResponse, paginatedResponse, requireAuth } from '@/lib/api-utils'
import { checkEligibility } from '@/lib/service-management'

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { serviceId, variationId, documents, userProfile } = body

    // Validate input
    if (!serviceId) {
      return errorResponse(
        "MISSING_SERVICE_ID",
        "Service ID is required",
        400
      )
    }

    // Check eligibility
    const { eligible, failedRules } = await checkEligibility(user.id, serviceId, userProfile)
    if (!eligible) {
      return errorResponse(
        "NOT_ELIGIBLE",
        "You do not meet the eligibility requirements for this service",
        403,
        { failedRules }
      )
    }

    // Create service request
    const result = await sql`
      INSERT INTO service_requests (
        user_id, service_id, variation_id, documents, workflow_state, status
      )
      VALUES (
        ${user.id}, ${serviceId}, ${variationId || null}, 
        ${JSON.stringify(documents || {})}, 'submitted', 'pending'
      )
      RETURNING id, service_id, user_id, status, workflow_state, created_at
    `

    return successResponse({ request: result[0] }, {})
  } catch (error: any) {
    console.error('Request creation error:', error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse(
      "REQUEST_CREATE_ERROR",
      "Failed to create service request",
      500
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    let whereClause = `WHERE sr.user_id = '${user.id}'`
    if (status) {
      whereClause += ` AND sr.status = '${status}'`
    }

    // Get total count
    const countResult = await sql.unsafe(`
      SELECT COUNT(*) as total FROM service_requests sr ${whereClause}
    `)
    const total = parseInt(countResult[0].total)

    // Get paginated results
    const requests = await sql.unsafe(`
      SELECT sr.id, sr.service_id, sr.user_id, sr.status, sr.workflow_state, 
        sr.created_at, sr.updated_at, s.name as service_name, s.name_am, s.name_or,
        sv.variation_name, sv.variation_type
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      LEFT JOIN service_variations sv ON sr.variation_id = sv.id
      ${whereClause}
      ORDER BY sr.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return paginatedResponse(requests, page, limit, total)
  } catch (error: any) {
    console.error('Request fetch error:', error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse(
      "REQUEST_FETCH_ERROR",
      "Failed to fetch requests",
      500
    )
  }
}
