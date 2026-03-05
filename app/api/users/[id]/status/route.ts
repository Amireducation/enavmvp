import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!["active", "pending", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Don't allow admin to suspend themselves
    if (id === user.id && status === "suspended") {
      return NextResponse.json({ error: "Cannot suspend your own account" }, { status: 400 })
    }

    const updated = await sql`
      UPDATE users SET
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, email, status
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log the action
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'status_change', 'user', ${id}, ${JSON.stringify({ status })})
    `

    return NextResponse.json({ user: updated[0], message: `User status changed to ${status}` })
  } catch (error) {
    console.error("User status update error:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
