import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromRequest } from '@/lib/api-utils'
import { checkEligibility } from '@/lib/service-management'

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { serviceId, variationId, documents, userProfile } = body

    // Check eligibility
    const { eligible, failedRules } = await checkEligibility(user.id, serviceId, userProfile)
    if (!eligible) {
      return NextResponse.json({
        error: 'Not eligible',
        failedRules
      }, { status: 403 })
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

    return NextResponse.json({ request: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Request creation error:', error)
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let query = `
      SELECT sr.*, s.name as service_name, s.name_am, s.name_or,
        sv.variation_name, sv.variation_type
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      LEFT JOIN service_variations sv ON sr.variation_id = sv.id
      WHERE sr.user_id = ${user.id}
    `

    if (status) {
      query += ` AND sr.status = '${status}'`
    }

    query += ` ORDER BY sr.created_at DESC LIMIT 50`

    const requests = await sql(query)
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Request fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}
