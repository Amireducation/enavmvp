import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const result = await sql`
      SELECT id, name, name_am, name_or, icon, description, sort_order
      FROM service_categories
      WHERE is_active = TRUE
      ORDER BY sort_order
    `
    return successResponse(result)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return errorResponse("CATEGORIES_FETCH_ERROR", "Failed to fetch categories", 500)
  }
}
