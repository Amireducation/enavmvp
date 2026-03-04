import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/api-utils"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT id, email, full_name, role, status, preferred_language, email_verified,
             avatar_url, phone, address, city, region, created_at, last_login_at
      FROM users WHERE id = ${user.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = result[0]
    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        status: userData.status,
        preferredLanguage: userData.preferred_language,
        emailVerified: userData.email_verified,
        avatarUrl: userData.avatar_url,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        region: userData.region,
        createdAt: userData.created_at,
        lastLoginAt: userData.last_login_at,
      },
    })
  } catch (error) {
    console.error("Error in /api/auth/me:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
