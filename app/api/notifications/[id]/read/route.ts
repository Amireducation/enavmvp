import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await sql`
      UPDATE notifications
      SET is_read = TRUE, read_at = NOW()
      WHERE id = ${id} AND user_id = ${user.sub}
    `

    return NextResponse.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Mark notification read error:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
