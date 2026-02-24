import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profiles = await sql`
      SELECT u.id, u.full_name, u.phone, u.email, u.preferred_language as language_preference,
        u.address, u.city, u.region, u.avatar_url, u.role, u.status, u.created_at,
        np.email_enabled as email, np.sms_enabled as sms, np.push_enabled as push
      FROM users u
      LEFT JOIN notification_preferences np ON u.id = np.user_id
      WHERE u.id = ${user.id}
    `

    if (profiles.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const p = profiles[0]
    return NextResponse.json({
      profile: {
        full_name: p.full_name,
        phone: p.phone,
        email: p.email,
        address: p.address,
        city: p.city,
        region: p.region,
        language_preference: p.language_preference,
        notification_preferences: {
          email: p.email ?? true,
          sms: p.sms ?? false,
          push: p.push ?? false,
        },
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, phone, address, city, region, language_preference } = body

    await sql`
      UPDATE users SET
        full_name = COALESCE(${full_name || null}, full_name),
        phone = COALESCE(${phone || null}, phone),
        address = COALESCE(${address || null}, address),
        city = COALESCE(${city || null}, city),
        region = COALESCE(${region || null}, region),
        preferred_language = COALESCE(${language_preference || null}, preferred_language),
        updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
