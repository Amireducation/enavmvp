import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest, successResponse, errorResponse, paginatedResponse, requireAuth } from "@/lib/api-utils"

function generateTrackingNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, "0")
  return `ETH-${year}-${random}`
}

export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit

    let applications
    let total = 0

    if (user.role === "citizen") {
      const countResult = await sql`SELECT COUNT(*) as total FROM service_requests WHERE user_id = ${user.id}`
      total = parseInt(countResult[0].total)

      applications = await sql`
        SELECT sr.id, sr.tracking_number, sr.status, sr.priority,
          sr.form_data as submitted_data, sr.reviewer_notes as notes,
          sr.created_at, sr.updated_at, sr.completed_at,
          s.id as service_id, s.name as service_name
        FROM service_requests sr
        JOIN services s ON sr.service_id = s.id
        WHERE sr.user_id = ${user.id}
        ORDER BY sr.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      const countResult = await sql`SELECT COUNT(*) as total FROM service_requests`
      total = parseInt(countResult[0].total)

      applications = await sql`
        SELECT sr.id, sr.tracking_number, sr.status, sr.priority,
          sr.form_data as submitted_data, sr.reviewer_notes as notes,
          sr.created_at, sr.updated_at, sr.completed_at,
          s.id as service_id, s.name as service_name,
          u.full_name as applicant_name, u.email as applicant_email
        FROM service_requests sr
        JOIN services s ON sr.service_id = s.id
        JOIN users u ON sr.user_id = u.id
        ORDER BY sr.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return paginatedResponse(applications, page, limit, total)
  } catch (error: any) {
    console.error("Applications fetch error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("APPLICATIONS_FETCH_ERROR", "Failed to fetch applications", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { service_id, submitted_data } = body

    if (!service_id) {
      return errorResponse("MISSING_SERVICE_ID", "Service ID is required", 400)
    }

    const trackingNumber = generateTrackingNumber()

    const application = await sql`
      INSERT INTO service_requests (tracking_number, user_id, service_id, form_data, status)
      VALUES (${trackingNumber}, ${user.id}, ${service_id}, ${JSON.stringify(submitted_data || {})}, 'submitted')
      RETURNING id, tracking_number, status, created_at
    `

    // Create notification for the user
    await sql`
      INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
      VALUES (${user.id}, 'Application Submitted', ${'Your application ' + trackingNumber + ' has been submitted successfully. You can track its progress from your dashboard.'}, 'success', 'service_request', ${application[0].id})
    `

    return successResponse({
      application: application[0],
      message: `Application submitted successfully. Tracking number: ${trackingNumber}`,
    })
  } catch (error: any) {
    console.error("Application creation error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("APPLICATION_CREATE_ERROR", "Failed to submit application", 500)
  }
}
