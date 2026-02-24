import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
    }

    // Verify current password
    const verified = await sql`
      SELECT id FROM users
      WHERE id = ${user.sub}
        AND password_hash = crypt(${currentPassword}, password_hash)
    `

    if (verified.length === 0) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Update password
    await sql`
      UPDATE users
      SET password_hash = crypt(${newPassword}, gen_salt('bf', 12)), updated_at = NOW()
      WHERE id = ${user.sub}
    `

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
