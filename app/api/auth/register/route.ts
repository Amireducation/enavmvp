import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { fullName, email, password, role } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Full name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const validRoles = ["citizen", "employee", "admin", "partner"]
    const userRole = validRoles.includes(role) ? role : "citizen"

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Create user with hashed password
    const newUser = await sql`
      INSERT INTO users (full_name, email, password_hash, role, status)
      VALUES (${fullName}, ${email}, crypt(${password}, gen_salt('bf', 12)), ${userRole}, 'active')
      RETURNING id, email, full_name, role
    `

    // Create default notification preferences
    await sql`
      INSERT INTO notification_preferences (user_id)
      VALUES (${newUser[0].id})
    `

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        full_name: newUser[0].full_name,
        role: newUser[0].role,
      },
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
