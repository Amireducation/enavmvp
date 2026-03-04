import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"

/**
 * GET /api/g2b/entity-types
 * Get all business entity types
 */
export async function GET(request: Request) {
  try {
    const entityTypes = await sql`
      SELECT 
        id, code, name, name_am, name_or, description, is_active
      FROM business_entity_types
      WHERE is_active = TRUE
      ORDER BY name ASC
    `

    return successResponse(entityTypes)
  } catch (error) {
    console.error("Entity types fetch error:", error)
    return errorResponse("ENTITY_TYPES_FETCH_ERROR", "Failed to fetch business entity types", 500)
  }
}
