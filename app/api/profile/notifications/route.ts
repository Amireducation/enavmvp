import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { preferences } = body

    // Upsert notification preferences
    await sql`
      INSERT INTO notification_preferences (user_id, email_notifications, sms_notifications, push_notifications)
      VALUES (${user.sub}, ${preferences?.email ?? true}, ${preferences?.sms ?? false}, ${preferences?.push ?? false})
      ON CONFLICT (user_id) DO UPDATE SET
        email_notifications = ${preferences?.email ?? true},
        sms_notifications = ${preferences?.sms ?? false},
        push_notifications = ${preferences?.push ?? false},
        updated_at = NOW()
    `

    return NextResponse.json({ message: "Notification preferences updated" })
  } catch (error) {
    console.error("Notification preferences update error:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
