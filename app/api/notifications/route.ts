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

export async function PUT(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { notificationId, action } = body

    if (!notificationId || !action) {
      return errorResponse("INVALID_REQUEST", "Missing required fields", 400)
    }

    if (action === "mark-read") {
      await sql.unsafe(`
        UPDATE notifications 
        SET is_read = true, updated_at = NOW()
        WHERE id = '${notificationId}' AND user_id = '${user.id}'
      `)
    } else if (action === "mark-unread") {
      await sql.unsafe(`
        UPDATE notifications 
        SET is_read = false, updated_at = NOW()
        WHERE id = '${notificationId}' AND user_id = '${user.id}'
      `)
    } else if (action === "delete") {
      await sql.unsafe(`
        DELETE FROM notifications 
        WHERE id = '${notificationId}' AND user_id = '${user.id}'
      `)
    } else if (action === "mark-all-read") {
      await sql.unsafe(`
        UPDATE notifications 
        SET is_read = true, updated_at = NOW()
        WHERE user_id = '${user.id}' AND is_read = false
      `)
    }

    return successResponse({ success: true })
  } catch (error: any) {
    console.error("Notification update error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("NOTIFICATION_UPDATE_ERROR", "Failed to update notification", 500)
  }
}
