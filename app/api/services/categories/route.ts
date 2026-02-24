import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT name FROM service_categories
      WHERE is_active = TRUE
      ORDER BY sort_order
    `
    const categories = result.map((r) => r.name)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
