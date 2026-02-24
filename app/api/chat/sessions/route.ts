import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic } = await request.json()
    const sessionToken = randomUUID()

    const sessions = await sql`
      INSERT INTO chat_sessions (user_id, session_token, topic)
      VALUES (${user.id}, ${sessionToken}, ${topic || "general"})
      RETURNING id, session_token, created_at
    `

    return NextResponse.json({
      session: {
        id: sessions[0].id,
        token: sessions[0].session_token,
        createdAt: sessions[0].created_at,
      },
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await sql`
      SELECT id, topic, status, message_count, last_message_at, created_at
      FROM chat_sessions
      WHERE user_id = ${user.id}
      ORDER BY last_message_at DESC NULLS LAST
      LIMIT 20
    `

    return NextResponse.json({
      sessions: sessions.map((s: Record<string, unknown>) => ({
        id: s.id,
        topic: s.topic,
        status: s.status,
        messageCount: s.message_count,
        lastMessageAt: s.last_message_at,
        createdAt: s.created_at,
      })),
    })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
