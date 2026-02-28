import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest, successResponse, errorResponse, requireRole } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const minFee = searchParams.get("minFee")
    const maxFee = searchParams.get("maxFee")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const offset = (page - 1) * limit

    // Build query with standardized field naming
    const baseQuery = `
      SELECT s.id, s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        sc.name as category, s.service_fee,
        s.estimated_processing_days,
        s.requirements, s.agency, s.status, s.online_available
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.status = 'active'
    `

    const whereConditions: string[] = []
    if (search) whereConditions.push(`(s.name ILIKE '%${search}%' OR s.description ILIKE '%${search}%')`)
    if (category) whereConditions.push(`sc.name = '${category}'`)
    if (minFee) whereConditions.push(`s.service_fee >= ${parseFloat(minFee)}`)
    if (maxFee) whereConditions.push(`s.service_fee <= ${parseFloat(maxFee)}`)

    const whereClause = whereConditions.length > 0 ? "AND " + whereConditions.join(" AND ") : ""

    // Get total count
    const countResult = await sql.unsafe(`SELECT COUNT(*) as total FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.status = 'active' ${whereClause}`)
    const total = parseInt(countResult[0].total)

    // Get paginated results
    const services = await sql.unsafe(
      `${baseQuery} ${whereClause} ORDER BY s.name LIMIT ${limit} OFFSET ${offset}`
    )

    return successResponse(services, { page, pageSize: limit, total })
  } catch (error) {
    console.error("Services fetch error:", error)
    return errorResponse("SERVICES_FETCH_ERROR", "Failed to fetch services", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireRole(request, ["admin", "employee"])

    const body = await request.json()
    const { name, name_am, description, description_am, category_id, service_fee, estimated_processing_days, agency, requirements } = body

    // Validation
    if (!name) {
      return errorResponse("INVALID_INPUT", "Service name is required", 400)
    }

    const newService = await sql`
      INSERT INTO services (name, name_am, description, description_am, category_id, service_fee, estimated_processing_days, agency, requirements, created_by)
      VALUES (${name}, ${name_am || null}, ${description}, ${description_am || null}, ${category_id || null}, ${service_fee || 0}, ${estimated_processing_days || 7}, ${agency || null}, ${JSON.stringify(requirements || [])}, ${user.id})
      RETURNING id, name, description, service_fee, estimated_processing_days
    `

    return successResponse(newService[0], {})
  } catch (error: any) {
    console.error("Service creation error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    if (error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Insufficient permissions", 403)
    }
    return errorResponse("SERVICE_CREATE_ERROR", "Failed to create service", 500)
  }
}
