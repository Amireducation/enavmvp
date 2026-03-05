import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const loginHistory = await sql`
      SELECT id, user_id, status, ip_address, user_agent, created_at
      FROM login_history
      WHERE user_id = ${id}
      ORDER BY created_at DESC
      LIMIT 20
    `

    return NextResponse.json(loginHistory)
  } catch (error) {
    console.error("Login history fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch login history" }, { status: 500 })
  }
}
