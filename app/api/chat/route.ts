import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq()

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
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
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
Available Services: ${services.map((s: Record<string, unknown>) => `${s.name} (${s.service_fee} ETB, ~${s.estimated_processing_days} days)`).join(", ")}

Knowledge Base: ${knowledge.map((k: Record<string, unknown>) => `${k.title}: ${k.content}`).join("\n")}

FAQs: ${faqs.map((f: Record<string, unknown>) => `Q: ${f.question}\nA: ${f.answer}`).join("\n")}
`

    // Build messages for Groq
    const messages = conversationHistory || []
    messages.push({ role: "user", content: message })

    // Call Groq LLM
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT + "\n\nContext:\n" + contextStr,
      messages: messages.map((m: Record<string, unknown>) => ({
        role: m.role as "user" | "assistant",
        content: m.content as string,
      })),
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save to database if session exists
    if (sessionId) {
      await sql`
        INSERT INTO chat_messages (session_id, role, content)
        VALUES (${sessionId}, 'user', ${message}),
               (${sessionId}, 'assistant', ${text})
      `

      await sql`
        UPDATE chat_sessions 
        SET message_count = message_count + 2, last_message_at = NOW()
        WHERE id = ${sessionId}
      `
    }

    return NextResponse.json({
      response: text,
      usage: { inputTokens: 0, outputTokens: 0 },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Chat failed" }, { status: 500 })
  }
}
