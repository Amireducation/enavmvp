import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { preferences } = body

    if (!preferences) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Try to update existing record, if not exists insert new
    const existing = await sql`
      SELECT id FROM notification_preferences WHERE user_id = ${user.id}
    `

    if (existing.length > 0) {
      await sql`
        UPDATE notification_preferences SET
          email_enabled = ${preferences.email || false},
          sms_enabled = ${preferences.sms || false},
          push_enabled = ${preferences.push || false},
          updated_at = NOW()
        WHERE user_id = ${user.id}
      `
    } else {
      await sql`
        INSERT INTO notification_preferences (user_id, email_enabled, sms_enabled, push_enabled)
        VALUES (${user.id}, ${preferences.email || false}, ${preferences.sms || false}, ${preferences.push || false})
      `
    }

    return NextResponse.json({ message: "Notification preferences updated" })
  } catch (error) {
    console.error("Notification preferences update error:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
