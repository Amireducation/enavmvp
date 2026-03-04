import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

/**
 * GET /api/services/g2b
 * G2B Service Discovery API
 * Query parameters:
 * - entity_type: business entity type code
 * - sector: business sector code
 * - audience: filter by target_audience (citizen, business, both)
 * - page: pagination page (default 1)
 * - limit: items per page (default 50, max 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get("entity_type")
    const sector = searchParams.get("sector")
    const audience = searchParams.get("audience") || "business"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        s.id,
        s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        s.service_code,
        sc.id as category_id, sc.name as category, sc.name_am as category_am,
        bs.id as sector_id, bs.code as sector_code, bs.name as sector_name, bs.name_am as sector_name_am, bs.icon as sector_icon,
        s.service_fee,
        s.min_processing_days,
        s.max_processing_days,
        s.estimated_processing_days,
        s.online_available,
        s.is_renewable,
        s.renewal_period_months,
        s.validity_period_months,
        s.target_audience,
        s.status,
        s.agency,
        COUNT(*) OVER() as total_count
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      LEFT JOIN business_sectors bs ON s.sector_id = bs.id
      WHERE s.status = 'active'
        AND (s.target_audience IN ('both', $1) OR s.target_audience = 'business')
    `

    const params: any[] = [audience]

    if (entityType) {
      query += ` AND ($2::text IS NULL OR s.required_entity_types @> $2::jsonb)`
      params.push(`"${entityType}"`)
    }

    if (sector) {
      query += ` AND ($${params.length + 1}::text IS NULL OR bs.code = $${params.length + 1})`
      params.push(sector)
    }

    query += ` ORDER BY s.name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const services = await sql.unsafe(query, params)

    if (services.length === 0) {
      return paginatedResponse([], page, limit, 0)
    }

    const total = parseInt(services[0].total_count)

    return paginatedResponse(services, page, limit, total)
  } catch (error) {
    console.error("G2B services discovery error:", error)
    return errorResponse("G2B_DISCOVERY_ERROR", "Failed to discover G2B services", 500)
  }
}
