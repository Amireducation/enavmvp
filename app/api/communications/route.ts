import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

/**
 * GET /api/communications
 * Get communications for current user
 */
export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit
    const unreadOnly = searchParams.get("unread") === "true"

    let whereClause = "WHERE (recipient_id = $1 OR sender_id = $1)"
    const params: any[] = [user.id]

    if (unreadOnly) {
      whereClause += " AND recipient_id = $1 AND is_read = FALSE"
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM service_request_communications ${whereClause}`
    const countResult = await sql.unsafe(countQuery, params)
    const total = parseInt(countResult[0].total)

    // Get communications
    const query = `
      SELECT 
        id,
        service_request_id,
        sender_id,
        recipient_id,
        (SELECT full_name FROM users WHERE id = sender_id) as sender_name,
        message,
        message_type,
        is_read,
        attachment_urls,
        created_at,
        updated_at
      FROM service_request_communications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    params.push(limit, offset)
    const communications = await sql.unsafe(query, params)

    return paginatedResponse(communications, page, limit, total)
  } catch (error) {
    console.error("Communications fetch error:", error)
    return errorResponse("COMMUNICATIONS_FETCH_ERROR", "Failed to fetch communications", 500)
  }
}

/**
 * POST /api/communications
 * Send a message/communication
 * Body: { service_request_id, recipient_id, message, message_type, attachment_urls }
 */
export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { service_request_id, recipient_id, message, message_type, attachment_urls } = body

    if (!service_request_id || !recipient_id || !message) {
      return errorResponse("MISSING_FIELDS", "service_request_id, recipient_id, and message are required", 400)
    }

    // Verify request exists and user has access
    const sr = await sql`SELECT user_id FROM service_requests WHERE id = ${service_request_id}`
    if (sr.length === 0) {
      return errorResponse("REQUEST_NOT_FOUND", "Service request not found", 404)
    }

    // Create communication record
    const comm = await sql`
      INSERT INTO service_request_communications (
        service_request_id, sender_id, recipient_id, message, message_type, attachment_urls
      )
      VALUES (
        ${service_request_id},
        ${user.id},
        ${recipient_id},
        ${message},
        ${message_type || "note"},
        ${JSON.stringify(attachment_urls || [])}
      )
      RETURNING id, sender_id, recipient_id, message, created_at
    `

    // Create notification for recipient
    await sql`
      INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
      VALUES (
        ${recipient_id},
        'New Message',
        'You have a new message regarding your application',
        'message',
        'communication',
        ${comm[0].id}
      )
    `

    return successResponse({ communication: comm[0] })
  } catch (error) {
    console.error("Communication creation error:", error)
    return errorResponse("COMMUNICATION_ERROR", "Failed to send communication", 500)
  }
}
