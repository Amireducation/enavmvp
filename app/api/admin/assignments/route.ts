import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

/**
 * POST /api/admin/assignments
 * Assign a service request to an employee
 * Body: { service_request_id, assigned_to_id, notes }
 */
export async function POST(request: Request) {
  try {
    const user = requireRole(request, ["admin"])
    const body = await request.json()
    const { service_request_id, assigned_to_id, notes } = body

    if (!service_request_id || !assigned_to_id) {
      return errorResponse("MISSING_FIELDS", "service_request_id and assigned_to_id are required", 400)
    }

    // Verify request exists
    const sr = await sql`SELECT id FROM service_requests WHERE id = ${service_request_id}`
    if (sr.length === 0) {
      return errorResponse("REQUEST_NOT_FOUND", "Service request not found", 404)
    }

    // Verify assignee is employee
    const assignee = await sql`SELECT id, role FROM users WHERE id = ${assigned_to_id} AND role IN ('employee', 'admin')`
    if (assignee.length === 0) {
      return errorResponse("INVALID_ASSIGNEE", "Assignee must be an employee or admin", 400)
    }

    // Deactivate previous assignments
    await sql`UPDATE service_request_assignments SET is_active = FALSE WHERE service_request_id = ${service_request_id} AND is_active = TRUE`

    // Create new assignment
    const assignment = await sql`
      INSERT INTO service_request_assignments (service_request_id, assigned_to_id, assigned_by_id, notes)
      VALUES (${service_request_id}, ${assigned_to_id}, ${user.id}, ${notes || null})
      RETURNING id, service_request_id, assigned_to_id, created_at
    `

    // Create notification
    await sql`
      INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
      VALUES (
        ${assigned_to_id},
        'New Request Assigned',
        'A new service request has been assigned to you',
        'assignment',
        'service_request',
        ${service_request_id}
      )
    `

    return successResponse({ assignment: assignment[0] })
  } catch (error) {
    console.error("Assignment creation error:", error)
    return errorResponse("ASSIGNMENT_ERROR", "Failed to create assignment", 500)
  }
}

/**
 * GET /api/admin/assignments
 * Get all active assignments
 */
export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const { searchParams } = new URL(request.url)
    const assignedToId = searchParams.get("assigned_to_id")

    let query = `
      SELECT 
        sra.id,
        sra.service_request_id,
        sra.assigned_to_id,
        ea.full_name as assigned_to_name,
        sra.assigned_by_id,
        ab.full_name as assigned_by_name,
        sr.tracking_number,
        s.name as service_name,
        sr.status,
        sra.created_at,
        sra.updated_at
      FROM service_request_assignments sra
      JOIN users ea ON sra.assigned_to_id = ea.id
      JOIN users ab ON sra.assigned_by_id = ab.id
      JOIN service_requests sr ON sra.service_request_id = sr.id
      JOIN services s ON sr.service_id = s.id
      WHERE sra.is_active = TRUE
    `

    if (assignedToId) {
      query += ` AND sra.assigned_to_id = $1`
    } else if (user.role === "employee") {
      query += ` AND sra.assigned_to_id = $1`
    }

    query += ` ORDER BY sra.created_at DESC`

    const params: any[] = []
    if (assignedToId || user.role === "employee") {
      params.push(assignedToId || user.id)
    }

    const assignments = await sql.unsafe(query, params)
    return successResponse(assignments)
  } catch (error) {
    console.error("Assignments fetch error:", error)
    return errorResponse("ASSIGNMENTS_FETCH_ERROR", "Failed to fetch assignments", 500)
  }
}
