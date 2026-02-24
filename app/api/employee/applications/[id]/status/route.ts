import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["employee", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const { status, notes } = await request.json()

    const validStatuses = ["pending", "under_review", "approved", "rejected", "completed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await sql`
      UPDATE service_requests SET
        status = ${status},
        notes = COALESCE(${notes || null}, notes),
        assigned_to = ${user.sub},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, status
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application: updated[0] })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
