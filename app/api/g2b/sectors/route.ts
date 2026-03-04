import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"

/**
 * GET /api/g2b/sectors
 * Get all business sectors
 */
export async function GET(request: Request) {
  try {
    const sectors = await sql`
      SELECT 
        id, code, name, name_am, name_or, description, icon, naics_code, 
        parent_sector_id, is_active
      FROM business_sectors
      WHERE is_active = TRUE
      ORDER BY name ASC
    `

    return successResponse(sectors)
  } catch (error) {
    console.error("Sectors fetch error:", error)
    return errorResponse("SECTORS_FETCH_ERROR", "Failed to fetch business sectors", 500)
  }
}
