import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { validateEmail, validatePassword, ValidationRules } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { fullName, email, password, confirmPassword, role } = await request.json()

    // Validate inputs
    if (!fullName || !email || !password) {
      return errorResponse(
        "MISSING_FIELDS",
        "Full name, email, and password are required",
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

    if (!validatePassword(password)) {
      return errorResponse(
        "WEAK_PASSWORD",
        ValidationRules.password.patternMessage + " and be at least 8 characters",
        400
      )
    }

    if (password !== confirmPassword) {
      return errorResponse(
        "PASSWORD_MISMATCH",
        "Passwords do not match",
        400
      )
    }

    if (fullName.length < 2) {
      return errorResponse(
        "INVALID_NAME",
        "Full name must be at least 2 characters",
        400
      )
    }

    const validRoles = ["citizen", "employee", "admin", "partner"]
    const userRole = validRoles.includes(role) ? role : "citizen"

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return errorResponse(
        "EMAIL_EXISTS",
        "An account with this email already exists",
        409
      )
    }

    // Create user with hashed password
    const newUser = await sql`
      INSERT INTO users (full_name, email, password_hash, role, status, preferred_language)
      VALUES (${fullName}, ${email}, crypt(${password}, gen_salt('bf', 12)), ${userRole}, 'active', 'en')
      RETURNING id, email, full_name, role
    `

    // Create default notification preferences
    await sql`
      INSERT INTO notification_preferences (user_id)
      VALUES (${newUser[0].id})
    `

    return successResponse(
      {
        message: "Registration successful",
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          full_name: newUser[0].full_name,
          role: newUser[0].role,
        },
      },
      {}
    )
  } catch (error) {
    console.error("Registration error:", error)
    return errorResponse(
      "REGISTRATION_ERROR",
      "An error occurred during registration. Please try again.",
      500
    )
  }
}
