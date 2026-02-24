import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { serviceName, description, estimatedDemand } = await request.json()

    if (!serviceName || !description) {
      return NextResponse.json({ error: "Service name and description required" }, { status: 400 })
    }

    const expansions = await sql`
      INSERT INTO service_expansion_requests 
        (user_id, service_name, description, estimated_demand)
      VALUES (${user.id}, ${serviceName}, ${description}, ${estimatedDemand || 0})
      RETURNING id, service_name, description, estimated_demand, upvotes, downvotes, status, created_at
    `

    // Log audit trail
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'service_expansion_create', 'service_expansion', ${expansions[0].id}, ${JSON.stringify({ service_name: serviceName, description })})
    `

    return NextResponse.json({
      expansion: {
        id: expansions[0].id,
        serviceName: expansions[0].service_name,
        description: expansions[0].description,
        estimatedDemand: expansions[0].estimated_demand,
        upvotes: expansions[0].upvotes,
        downvotes: expansions[0].downvotes,
        status: expansions[0].status,
        createdAt: expansions[0].created_at,
      },
    })
  } catch (error) {
    console.error("Service expansion create error:", error)
    return NextResponse.json({ error: "Failed to create expansion request" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status")

    let query
    if (user.role === "admin") {
      // Admin sees all
      query = await sql`
        SELECT id, service_name, description, estimated_demand, upvotes, downvotes, status, created_at
        FROM service_expansion_requests
        WHERE ${status ? `status = ${status}` : "TRUE"}
        ORDER BY upvotes DESC, created_at DESC
        LIMIT 100
      `
    } else {
      // Citizens see approved + pending
      query = await sql`
        SELECT id, service_name, description, estimated_demand, upvotes, downvotes, status, created_at
        FROM service_expansion_requests
        WHERE status IN ('pending', 'approved', 'implemented')
        ORDER BY upvotes DESC, created_at DESC
        LIMIT 100
      `
    }

    return NextResponse.json({
      expansions: query.map((e: Record<string, unknown>) => ({
        id: e.id,
        serviceName: e.service_name,
        description: e.description,
        estimatedDemand: e.estimated_demand,
        upvotes: e.upvotes,
        downvotes: e.downvotes,
        status: e.status,
        createdAt: e.created_at,
      })),
    })
  } catch (error) {
    console.error("Service expansion list error:", error)
    return NextResponse.json({ error: "Failed to fetch expansions" }, { status: 500 })
  }
}
