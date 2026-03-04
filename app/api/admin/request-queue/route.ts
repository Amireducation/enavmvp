import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

/**
 * GET /api/admin/request-queue
 * Get service requests for admin review
 * Filters: status, assigned_to, priority, service_id, date_range
 */
export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status") || "pending"
    const assignedTo = searchParams.get("assigned_to")
    const priority = searchParams.get("priority")
    const serviceId = searchParams.get("service_id")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "DESC"

    let whereConditions = ["sr.status = $1"]
    const params: any[] = [status]

    if (assignedTo) {
      whereConditions.push(`sra.assigned_to_id = $${params.length + 1}`)
      params.push(assignedTo)
    }

    if (priority) {
      whereConditions.push(`sr.priority = $${params.length + 1}`)
      params.push(priority)
    }

    if (serviceId) {
      whereConditions.push(`sr.service_id = $${params.length + 1}`)
      params.push(serviceId)
    }

    const whereClause = whereConditions.join(" AND ")

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM service_requests sr
      LEFT JOIN service_request_assignments sra ON sr.id = sra.service_request_id AND sra.is_active = TRUE
      WHERE ${whereClause}
    `
    const countResult = await sql.unsafe(countQuery, params)
    const total = parseInt(countResult[0].total)

    // Get requests with details
    const query = `
      SELECT 
        sr.id,
        sr.tracking_number,
        sr.user_id,
        u.full_name as applicant_name,
        u.email as applicant_email,
        sr.service_id,
        s.name as service_name,
        s.name_am as service_name_am,
        sr.status,
        sr.workflow_state,
        sr.priority,
        sr.created_at,
        sr.estimated_completion_date,
        sr.total_fees,
        sr.paid_amount,
        sr.payment_status,
        bp.business_name,
        bp.business_name_am,
        sra.assigned_to_id,
        ea.full_name as assigned_to_name,
        (SELECT COUNT(*) FROM service_request_documents WHERE service_request_id = sr.id) as document_count
      FROM service_requests sr
      JOIN users u ON sr.user_id = u.id
      JOIN services s ON sr.service_id = s.id
      LEFT JOIN business_profiles bp ON sr.business_profile_id = bp.id
      LEFT JOIN service_request_assignments sra ON sr.id = sra.service_request_id AND sra.is_active = TRUE
      LEFT JOIN users ea ON sra.assigned_to_id = ea.id
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    params.push(limit, offset)
    const requests = await sql.unsafe(query, params)

    return paginatedResponse(requests, page, limit, total)
  } catch (error) {
    console.error("Request queue fetch error:", error)
    return errorResponse("QUEUE_FETCH_ERROR", "Failed to fetch request queue", 500)
  }
}
