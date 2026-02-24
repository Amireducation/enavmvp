import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await sql`
      SELECT id as notification_id, type, title, message, is_read, priority,
        reference_type, reference_id, created_at
      FROM notifications
      WHERE user_id = ${user.sub}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
