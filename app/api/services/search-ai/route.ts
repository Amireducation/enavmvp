import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface AISearchResult {
  service_id: string
  name: string
  description_simple: string  // Simplified for AI context
  category: string
  service_fee: number
  processing_time_days: number
  online_available: boolean
  agency: string
  key_requirements: string[]  // Top 3 requirements only
  ai_summary: string  // One-line summary for chatbot
  relevance_confidence: number  // 0-1 score
  keywords: string[]  // Keywords for matching
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const language = searchParams.get("lang") || "en"  // en, am, or

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    // AI-optimized search with context injection
    const results = await sql`
      SELECT 
        s.id as service_id,
        s.name,
        s.description,
        s.description_am,
        s.description_or,
        sc.name as category,
        s.service_fee,
        s.estimated_processing_days,
        s.online_available,
        s.agency,
        s.requirements,
        -- Calculate relevance for AI context
        CASE 
          WHEN s.name ILIKE $1 THEN 0.95
          WHEN s.description ILIKE $2 THEN 0.75
          WHEN s.agency ILIKE $2 THEN 0.50
          ELSE 0.30
        END as relevance_confidence,
        -- Generate keywords for pattern matching
        array_cat(
          string_to_array(LOWER(s.name), ' '),
          string_to_array(LOWER(s.agency), ' ')
        ) as keywords
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.status = 'active'
        AND (
          s.name ILIKE $2 OR 
          s.description ILIKE $2 OR 
          s.agency ILIKE $2
        )
      ORDER BY relevance_confidence DESC
      LIMIT 10
    `

    // Transform for AI context injection
    const aiResults = results.map((r: any) => {
      const description = language === 'am' ? r.description_am : language === 'or' ? r.description_or : r.description
      const summary = description?.substring(0, 100) + '...' || r.name
      const requirements = Array.isArray(r.requirements) ? r.requirements.slice(0, 3) : []

      return {
        service_id: r.service_id,
        name: r.name,
        description_simple: summary,
        category: r.category,
        service_fee: Number(r.service_fee),
        processing_time_days: Number(r.estimated_processing_days),
        online_available: r.online_available,
        agency: r.agency,
        key_requirements: requirements,
        ai_summary: `${r.name} costs ETB ${r.service_fee} and takes ~${r.estimated_processing_days} days`,
        relevance_confidence: Number(r.relevance_confidence),
        keywords: r.keywords || [],
      }
    })

    return NextResponse.json({
      results: aiResults,
      query: query,
      language: language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ error: "AI search failed" }, { status: 500 })
  }
}
