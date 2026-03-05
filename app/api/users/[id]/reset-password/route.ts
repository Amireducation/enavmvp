import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    // Get user email
    const targetUser = await sql`SELECT id, email, full_name FROM users WHERE id = ${id}`
    
    if (targetUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12)
    
    // Update the password
    await sql`
      UPDATE users SET
        password_hash = crypt(${tempPassword}, gen_salt('bf', 12)),
        updated_at = NOW()
      WHERE id = ${id}
    `

    // Create notification for user
    await sql`
      INSERT INTO notifications (user_id, type, title, message, priority)
      VALUES (
        ${id},
        'security',
        'Password Reset',
        'Your password has been reset by an administrator. Please log in with your temporary password and change it immediately.',
        'high'
      )
    `

    // Log the action
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'password_reset', 'user', ${id}, ${JSON.stringify({ reset_by: user.email })})
    `

    // In production, you would send an email here
    // For now, return the temp password (in production, never do this!)
    return NextResponse.json({ 
      message: "Password reset successful",
      // Only for demo purposes - remove in production
      tempPassword: process.env.NODE_ENV === 'development' ? tempPassword : undefined
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
