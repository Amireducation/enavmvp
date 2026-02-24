import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    // Verify session belongs to user
    const sessions = await sql`
      SELECT id FROM chat_sessions WHERE id = ${sessionId} AND user_id = ${user.id}
    `

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Get all messages
    const messages = await sql`
      SELECT role, content, created_at
      FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      messages: messages.map((m: Record<string, unknown>) => ({
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
    })
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
