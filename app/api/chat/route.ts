import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse } from "@/lib/api-utils"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompt with context about services and help
const SYSTEM_PROMPT = `You are Ethiopian Navigator, an AI assistant helping citizens navigate government services in Ethiopia.

You have access to comprehensive information about:
- Government services (identity, land, business, tax, health, education, legal, transport)
- Application processes and requirements
- Processing times and fees
- Common questions and FAQs
- Service eligibility criteria

Your role is to:
1. Help citizens understand what services they need
2. Guide them through the application process
3. Answer questions about requirements and timelines
4. Provide information in multiple languages (English, Amharic, Oromo)
5. Recommend appropriate services based on their needs

Always be helpful, accurate, and professional. If you don't have specific information, suggest they contact the relevant agency or check the knowledge base.`

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const { session_id, message, context_data } = await request.json()

    if (!message || message.trim().length === 0) {
      return errorResponse("EMPTY_MESSAGE", "Message cannot be empty", 400)
    }

    // Get or create session
    let sessionId = session_id
    if (!sessionId) {
      const newSession = await sql`
        INSERT INTO chat_sessions (user_id, status, message_count)
        VALUES (${user.id}, 'active', 0)
        RETURNING id
      `
      sessionId = newSession[0].id
    }

    // Build context from knowledge base
    const knowledge = await sql`
      SELECT title, content FROM knowledge_articles 
      WHERE status = 'published' 
      LIMIT 5
    `

    const faqs = await sql`
      SELECT question, answer FROM faqs 
      WHERE is_featured = TRUE 
      LIMIT 5
    `

    const services = await sql`
      SELECT name, description, service_fee, estimated_processing_days 
      FROM services 
      WHERE status = 'active' 
      LIMIT 10
    `

    // Format context
    const contextStr = `
Available Services: ${services.map((s: any) => `${s.name} (${s.service_fee} ETB, ~${s.estimated_processing_days} days)`).join(", ")}

Knowledge Base: ${knowledge.map((k: any) => `${k.title}: ${k.content}`).join("\n")}

FAQs: ${faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n")}
`

    // Get conversation history
    const history = await sql`
      SELECT role, content FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    const messages = history.reverse().map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    messages.push({ role: "user", content: message })

    // Call Groq LLM
    const { text, usage } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT + "\n\nContext:\n" + contextStr,
      messages: messages as any,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save user message
    await sql`
      INSERT INTO chat_messages (session_id, role, content, tokens_used)
      VALUES (${sessionId}, 'user', ${message}, ${usage?.promptTokens || 0})
    `

    // Save AI response
    const response = await sql`
      INSERT INTO chat_messages (session_id, role, content, tokens_used, context_used)
      VALUES (${sessionId}, 'assistant', ${text}, ${usage?.completionTokens || 0}, ${JSON.stringify(context_data || {})})
      RETURNING created_at
    `

    // Update session
    await sql`
      UPDATE chat_sessions 
      SET message_count = message_count + 1, last_message_at = CURRENT_TIMESTAMP
      WHERE id = ${sessionId}
    `

    return successResponse({
      session_id: sessionId,
      response: text,
      tokens_used: usage?.totalTokens || 0,
      timestamp: response[0].created_at,
    })
  } catch (error: any) {
    console.error("Chat error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("CHAT_ERROR", "Failed to generate response", 500)
  }
}


export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const url = new URL(request.url)
    const session_id = url.searchParams.get("session_id")

    if (!session_id) {
      return errorResponse("MISSING_SESSION", "Session ID required", 400)
    }

    // Get session and validate ownership
    const sessions = await sql`
      SELECT id, status, message_count, created_at, last_message_at
      FROM chat_sessions
      WHERE id = ${session_id} AND user_id = ${user.id}
    `

    if (sessions.length === 0) {
      return errorResponse("SESSION_NOT_FOUND", "Chat session not found", 404)
    }

    // Get messages
    const messages = await sql`
      SELECT id, role, content, created_at, tokens_used
      FROM chat_messages
      WHERE session_id = ${session_id}
      ORDER BY created_at ASC
    `

    return successResponse({
      session: sessions[0],
      messages,
      message_count: messages.length,
    })
  } catch (error: any) {
    console.error("Get chat error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("FETCH_ERROR", "Failed to fetch chat", 500)
  }
}
