import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let faqs

    if (category) {
      faqs = await sql`
        SELECT id, question, question_am, question_or, answer, answer_am, answer_or,
          category, is_featured, sort_order
        FROM faqs
        WHERE is_active = TRUE AND category = ${category}
        ORDER BY sort_order
      `
    } else if (featured === "true") {
      faqs = await sql`
        SELECT id, question, question_am, question_or, answer, answer_am, answer_or,
          category, is_featured, sort_order
        FROM faqs
        WHERE is_active = TRUE AND is_featured = TRUE
        ORDER BY sort_order
      `
    } else {
      faqs = await sql`
        SELECT id, question, question_am, question_or, answer, answer_am, answer_or,
          category, is_featured, sort_order
        FROM faqs
        WHERE is_active = TRUE
        ORDER BY sort_order
      `
    }

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error("FAQs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}
