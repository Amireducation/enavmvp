import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest, successResponse, errorResponse, paginatedResponse, requireAuth } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100)
    const offset = (page - 1) * limit
    const unreadOnly = url.searchParams.get("unread") === "true"

    let whereClause = `WHERE user_id = '${user.id}'`
    if (unreadOnly) {
      whereClause += ` AND is_read = false`
    }

    const countResult = await sql.unsafe(`SELECT COUNT(*) as total FROM notifications ${whereClause}`)
    const total = parseInt(countResult[0].total)

    const notifications = await sql.unsafe(`
      SELECT id, type, title, message, is_read, priority,
        reference_type, reference_id, created_at
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return paginatedResponse(notifications, page, limit, total)
  } catch (error: any) {
    console.error("Notifications fetch error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("NOTIFICATIONS_FETCH_ERROR", "Failed to fetch notifications", 500)
  }
}
