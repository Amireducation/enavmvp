import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit
    const status = url.searchParams.get("status") || "all"

    let whereClause = "WHERE status != 'archived'"
    if (status !== "all") {
      whereClause = `WHERE status = '${status}'`
    }

    const countResult = await sql.unsafe(`SELECT COUNT(*) as total FROM service_expansion_requests ${whereClause}`)
    const total = parseInt(countResult[0].total)

    const expansions = await sql.unsafe(`
      SELECT id, service_name, description, estimated_demand, upvotes, downvotes, status, 
             user_id, created_at, review_notes
      FROM service_expansion_requests
      ${whereClause}
      ORDER BY upvotes DESC, created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return paginatedResponse(expansions, page, limit, total)
  } catch (error: any) {
    console.error("Service expansion fetch error:", error)
    return errorResponse("EXPANSION_FETCH_ERROR", "Failed to fetch service expansion requests", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const { service_name, description, estimated_demand } = await request.json()

    if (!service_name || !description) {
      return errorResponse("MISSING_FIELDS", "Service name and description required", 400)
    }

    const expansions = await sql`
      INSERT INTO service_expansion_requests 
        (user_id, service_name, description, estimated_demand, status)
      VALUES (${user.id}, ${service_name}, ${description}, ${estimated_demand || 0}, 'pending')
      RETURNING id, service_name, description, estimated_demand, upvotes, downvotes, status, created_at
    `

    // Log audit trail
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'service_expansion_create', 'service_expansion_request', ${expansions[0].id}, ${JSON.stringify({ service_name, description })})
    `

    // Create notification for admins
    const admins = await sql`SELECT id FROM users WHERE role = 'admin'`
    for (const admin of admins) {
      await sql`
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (${admin.id}, 'New Service Expansion Request', ${'A new service has been suggested: ' + service_name}, 'info', 'service_expansion', ${expansions[0].id})
      `
    }

    return successResponse({
      id: expansions[0].id,
      service_name: expansions[0].service_name,
      description: expansions[0].description,
      estimated_demand: expansions[0].estimated_demand,
      upvotes: expansions[0].upvotes,
      downvotes: expansions[0].downvotes,
      status: expansions[0].status,
      created_at: expansions[0].created_at,
    })
  } catch (error: any) {
    console.error("Service expansion creation error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("EXPANSION_CREATE_ERROR", "Failed to create service expansion request", 500)
  }
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
