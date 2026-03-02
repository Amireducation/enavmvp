import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

interface SearchResult {
  service_id: string
  name: string
  name_am: string
  name_or: string
  category: string
  description: string
  description_am: string
  description_or: string
  service_fee: number
  estimated_processing_days: number
  online_available: boolean
  agency: string
  requirements: string[]
  relevance_score: number
}

interface ServiceDetail {
  service_id: string
  name: string
  name_am: string
  name_or: string
  description: string
  description_am: string
  description_or: string
  category: string
  service_fee: number
  estimated_processing_days: number
  online_available: boolean
  agency: string
  contact_email: string
  contact_phone: string
  requirements: string[]
  // Additional fields for detail view
  steps: Array<{ number: number; description: string }>
  faq: Array<{ question: string; answer: string }>
  related_services: Array<{ id: string; name: string }>
  average_rating: number
  review_count: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category")
    const online = searchParams.get("online")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (!query && !category) {
      return errorResponse("MISSING_PARAMS", "Query or category parameter required", 400)
    }

    // Build dynamic query with relevance scoring
    let whereClause = "WHERE s.status = 'active'"
    const params: any[] = []

    if (query) {
      whereClause += ` AND (
        s.name ILIKE $${params.length + 1} OR 
        s.description ILIKE $${params.length + 1} OR 
        s.agency ILIKE $${params.length + 1}
      )`
      params.push(`%${query}%`)
    }

    if (category) {
      whereClause += ` AND sc.name = $${params.length + 1}`
      params.push(category)
    }

    if (online === "true") {
      whereClause += ` AND s.online_available = true`
    }

    // Search with relevance scoring
    const searchResults = await sql`
      SELECT 
        s.id as service_id,
        s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        sc.name as category,
        s.service_fee,
        s.estimated_processing_days,
        s.online_available,
        s.agency,
        s.requirements,
        -- Relevance scoring: name match > description match > agency match
        CASE 
          WHEN s.name ILIKE $1 THEN 10
          WHEN s.name ILIKE $2 THEN 8
          WHEN s.description ILIKE $2 THEN 5
          WHEN s.agency ILIKE $2 THEN 3
          ELSE 1
        END as relevance_score
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      ${whereClause}
      ORDER BY relevance_score DESC, s.name
      LIMIT $3 OFFSET $4
    `

    const formattedResults: SearchResult[] = searchResults.map((r: any) => ({
      service_id: r.service_id,
      name: r.name,
      name_am: r.name_am,
      name_or: r.name_or,
      category: r.category,
      description: r.description,
      description_am: r.description_am,
      description_or: r.description_or,
      service_fee: Number(r.service_fee),
      estimated_processing_days: Number(r.estimated_processing_days),
      online_available: r.online_available,
      agency: r.agency,
      requirements: Array.isArray(r.requirements) ? r.requirements : [],
      relevance_score: Number(r.relevance_score),
    }))

    const countResult = await sql`
      SELECT COUNT(*) as total FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      ${whereClause}
    `

    const total = Number(countResult[0].total)
    const page = Math.floor(offset / limit) + 1
    return paginatedResponse(formattedResults, page, limit, total)
  } catch (error) {
    console.error("Search error:", error)
    return errorResponse("SEARCH_ERROR", "Search failed", 500)
  }
}
