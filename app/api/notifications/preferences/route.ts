import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const prefs = await sql`
      SELECT id, user_id, email_enabled, sms_enabled, push_enabled, in_app_enabled,
             quiet_hours_start, quiet_hours_end, language, created_at, updated_at
      FROM notification_preferences
      WHERE user_id = ${user.id}
    `

    if (prefs.length === 0) {
      // Create default preferences
      const created = await sql`
        INSERT INTO notification_preferences (user_id, email_enabled, sms_enabled, push_enabled, in_app_enabled, language)
        VALUES (${user.id}, true, false, true, true, ${user.preferred_language || 'en'})
        RETURNING *
      `
      return NextResponse.json({ preferences: created[0] })
    }

    return NextResponse.json({ preferences: prefs[0] })
  } catch (error) {
    console.error("[v0] Preferences fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email_enabled, sms_enabled, push_enabled, in_app_enabled, quiet_hours_start, quiet_hours_end, language } = body

    const updated = await sql`
      UPDATE notification_preferences
      SET email_enabled = COALESCE(${email_enabled ?? null}, email_enabled),
          sms_enabled = COALESCE(${sms_enabled ?? null}, sms_enabled),
          push_enabled = COALESCE(${push_enabled ?? null}, push_enabled),
          in_app_enabled = COALESCE(${in_app_enabled ?? null}, in_app_enabled),
          quiet_hours_start = COALESCE(${quiet_hours_start ?? null}, quiet_hours_start),
          quiet_hours_end = COALESCE(${quiet_hours_end ?? null}, quiet_hours_end),
          language = COALESCE(${language ?? null}, language),
          updated_at = NOW()
      WHERE user_id = ${user.id}
      RETURNING *
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 })
    }

    return NextResponse.json({ preferences: updated[0] })
  } catch (error) {
    console.error("[v0] Preferences update error:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
