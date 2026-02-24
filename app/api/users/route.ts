import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await sql`
      SELECT id, email, full_name, phone, role, status, preferred_language,
        created_at, last_login_at
      FROM users
      ORDER BY created_at DESC
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, role, full_name, phone } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const newUser = await sql`
      INSERT INTO users (email, password_hash, full_name, phone, role, status)
      VALUES (${email}, crypt(${password}, gen_salt('bf', 12)), ${full_name || null}, ${phone || null}, ${role || 'citizen'}, 'active')
      RETURNING id, email, full_name, role, created_at
    `

    return NextResponse.json({ user: newUser[0] }, { status: 201 })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
