import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId, notificationType, channel, recipientAddress, subject, body, templateData } = await request.json()

    if (!userId || !notificationType || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const notifications = await sql`
      INSERT INTO notification_queue 
        (user_id, notification_type, channel, recipient_address, subject, body, template_data)
      VALUES (${userId}, ${notificationType}, ${channel}, ${recipientAddress}, ${subject || null}, ${body}, ${JSON.stringify(templateData || {})})
      RETURNING id, status, created_at
    `

    return NextResponse.json({
      notificationId: notifications[0].id,
      status: notifications[0].status,
      createdAt: notifications[0].created_at,
    })
  } catch (error) {
    console.error("Notification queue error:", error)
    return NextResponse.json({ error: "Failed to queue notification" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status") || "pending"
    const limit = parseInt(url.searchParams.get("limit") || "50")

    const notifications = await sql`
      SELECT id, user_id, notification_type, channel, recipient_address, status, retry_count, created_at
      FROM notification_queue
      WHERE status = ${status}
      ORDER BY created_at ASC
      LIMIT ${limit}
    `

    return NextResponse.json({
      notifications: notifications.map((n: Record<string, unknown>) => ({
        id: n.id,
        userId: n.user_id,
        type: n.notification_type,
        channel: n.channel,
        recipient: n.recipient_address,
        status: n.status,
        retries: n.retry_count,
        createdAt: n.created_at,
      })),
    })
  } catch (error) {
    console.error("Notification fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
