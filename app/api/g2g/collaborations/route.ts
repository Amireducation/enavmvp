import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

// G2G Collaboration API - Inter-agency communication and workflow
export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    // Build query conditions
    const conditions: string[] = []
    
    if (status) {
      conditions.push(`status = '${status}'`)
    }
    if (type) {
      conditions.push(`collaboration_type = '${type}'`)
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""

    // For now, we'll create a view of service request communications as G2G collaborations
    // This simulates inter-agency communication until we add dedicated G2G tables
    const collaborations = await sql.unsafe(`
      SELECT 
        src.id,
        src.subject,
        src.message,
        src.communication_type,
        src.created_at,
        src.is_read,
        sr.tracking_number,
        sr.status as request_status,
        s.name as service_name,
        s.agency as service_agency,
        u_from.full_name as from_user,
        u_from.role as from_role,
        u_to.full_name as to_user,
        u_to.role as to_role
      FROM service_request_communications src
      JOIN service_requests sr ON src.request_id = sr.id
      JOIN services s ON sr.service_id = s.id
      LEFT JOIN users u_from ON src.from_user_id = u_from.id
      LEFT JOIN users u_to ON src.to_user_id = u_to.id
      WHERE u_from.role IN ('admin', 'employee') OR u_to.role IN ('admin', 'employee')
      ORDER BY src.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM service_request_communications src
      JOIN service_requests sr ON src.request_id = sr.id
      LEFT JOIN users u_from ON src.from_user_id = u_from.id
      LEFT JOIN users u_to ON src.to_user_id = u_to.id
      WHERE u_from.role IN ('admin', 'employee') OR u_to.role IN ('admin', 'employee')
    `

    return paginatedResponse(
      collaborations.map((c: any) => ({
        id: c.id,
        subject: c.subject,
        message: c.message,
        type: c.communication_type || 'message',
        isRead: c.is_read,
        trackingNumber: c.tracking_number,
        requestStatus: c.request_status,
        service: {
          name: c.service_name,
          agency: c.service_agency,
        },
        from: {
          name: c.from_user,
          role: c.from_role,
        },
        to: {
          name: c.to_user,
          role: c.to_role,
        },
        createdAt: c.created_at,
      })),
      page,
      limit,
      parseInt(countResult[0].total)
    )
  } catch (error: any) {
    console.error("G2G collaboration fetch error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    if (error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Government employee access required", 403)
    }
    return errorResponse("FETCH_ERROR", "Failed to fetch collaborations", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const body = await request.json()

    const {
      requestId,
      toUserId,
      subject,
      message,
      communicationType = 'internal_note',
      attachmentUrl,
    } = body

    if (!requestId) {
      return errorResponse("INVALID_INPUT", "Request ID is required", 400)
    }
    if (!message) {
      return errorResponse("INVALID_INPUT", "Message is required", 400)
    }

    // Verify request exists
    const requestExists = await sql`
      SELECT id, tracking_number FROM service_requests WHERE id = ${requestId}
    `
    if (requestExists.length === 0) {
      return errorResponse("NOT_FOUND", "Service request not found", 404)
    }

    // Create communication
    const newComm = await sql`
      INSERT INTO service_request_communications (
        request_id,
        from_user_id,
        to_user_id,
        subject,
        message,
        communication_type,
        attachment_url,
        is_read
      ) VALUES (
        ${requestId},
        ${user.id},
        ${toUserId || null},
        ${subject || 'Internal Communication'},
        ${message},
        ${communicationType},
        ${attachmentUrl || null},
        false
      )
      RETURNING id, created_at
    `

    // If there's a recipient, create notification
    if (toUserId) {
      await sql`
        INSERT INTO notifications (user_id, title, message, type, priority, reference_type, reference_id)
        VALUES (
          ${toUserId},
          'New G2G Communication',
          ${subject || 'You have a new internal message regarding request ' + requestExists[0].tracking_number},
          'info',
          'normal',
          'communication',
          ${newComm[0].id}
        )
      `
    }

    return successResponse({
      id: newComm[0].id,
      trackingNumber: requestExists[0].tracking_number,
      message: "Communication sent successfully",
      createdAt: newComm[0].created_at,
    })
  } catch (error: any) {
    console.error("G2G communication create error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    if (error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Government employee access required", 403)
    }
    return errorResponse("CREATE_ERROR", "Failed to create communication", 500)
  }
}
