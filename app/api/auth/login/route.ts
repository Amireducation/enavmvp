import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user and verify password using pgcrypto's crypt
    const users = await sql`
      SELECT id, email, full_name, role, status, preferred_language
      FROM users
      WHERE email = ${email}
        AND password_hash = crypt(${password}, password_hash)
        AND status = 'active'
    `

    if (users.length === 0) {
      // Log failed attempt
      await sql`
        INSERT INTO login_history (email, status, failure_reason)
        VALUES (${email}, 'failed', 'Invalid credentials')
      `
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Update last login
    await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}`

    // Log successful login
    await sql`
      INSERT INTO login_history (user_id, email, status)
      VALUES (${user.id}, ${email}, 'success')
    `

    // Generate a simple token (base64 encoded JSON with expiry)
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    }
    const token = btoa(JSON.stringify({ alg: "none" })) + "." + btoa(JSON.stringify(tokenPayload)) + ".signature"

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        preferred_language: user.preferred_language,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
