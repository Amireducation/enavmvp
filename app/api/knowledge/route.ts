import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    let articles

    if (search) {
      articles = await sql`
        SELECT id, title, content, category, tags, status, view_count, created_at
        FROM knowledge_articles
        WHERE status = 'published'
          AND (title ILIKE '%' || ${search} || '%' OR content ILIKE '%' || ${search} || '%')
        ORDER BY view_count DESC
      `
    } else if (category) {
      articles = await sql`
        SELECT id, title, content, category, tags, status, view_count, created_at
        FROM knowledge_articles
        WHERE status = 'published' AND category = ${category}
        ORDER BY created_at DESC
      `
    } else {
      articles = await sql`
        SELECT id, title, content, category, tags, status, view_count, created_at
        FROM knowledge_articles
        WHERE status = 'published'
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Knowledge fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
