import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { validateEmail } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return errorResponse(
        "INVALID_INPUT",
        "Email and password are required",
        400
      )
    }

    if (!validateEmail(email)) {
      return errorResponse(
        "INVALID_EMAIL",
        "Please enter a valid email address",
        400
      )
    }

    if (!password || password.length < 1) {
      return errorResponse(
        "INVALID_PASSWORD",
        "Password is required",
        400
      )
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
      return errorResponse(
        "INVALID_CREDENTIALS",
        "Invalid email or password",
        401
      )
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
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    }
    const token = btoa(JSON.stringify({ alg: "none" })) + "." + btoa(JSON.stringify(tokenPayload)) + ".signature"

    // Create response with token and user data
    const response = successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        preferred_language: user.preferred_language,
      },
    })

    // Set HTTP-only cookies for middleware to read
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    response.cookies.set('userRole', user.role, {
      httpOnly: false, // Allow JavaScript access to role for UI logic
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    response.cookies.set('userId', user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return errorResponse(
      "LOGIN_ERROR",
      "An error occurred during login. Please try again.",
      500
    )
  }
}
