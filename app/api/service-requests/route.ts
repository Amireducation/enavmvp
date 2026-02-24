import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { service_name, service_description, category_suggestion, justification } = body

    if (!service_name || !service_description) {
      return NextResponse.json({ error: "Service name and description are required" }, { status: 400 })
    }

    // Log the service request as an audit entry for admin review
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, new_values)
      VALUES (
        ${user.sub},
        'service_request_suggestion',
        'service',
        ${JSON.stringify({ service_name, service_description, category_suggestion, justification })}
      )
    `

    return NextResponse.json({
      message: "Service request submitted successfully. Our team will review it shortly.",
    }, { status: 201 })
  } catch (error) {
    console.error("Service request error:", error)
    return NextResponse.json({ error: "Failed to submit service request" }, { status: 500 })
  }
}
