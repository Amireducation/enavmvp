import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest, successResponse, errorResponse, requireAuth } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return errorResponse("UNAUTHORIZED", "Admin access required", 403)
    }

    const { searchParams } = new URL(request.url)
    const rating = searchParams.get("rating")
    const category = searchParams.get("category")

    let query = `
      SELECT f.id as feedback_id, f.user_id, f.service_id, f.rating, f.comment as comments,
        f.category, f.status, f.created_at,
        u.full_name as user_name, u.email as user_email,
        s.name as service_name
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN services s ON f.service_id = s.id
      WHERE 1=1
    `

    if (rating && rating !== "all") {
      query += ` AND f.rating = ${parseInt(rating)}`
    }

    if (category && category !== "all") {
      query += ` AND f.category = '${category}'`
    }

    query += ` ORDER BY f.created_at DESC LIMIT 100`

    const feedback = await sql.unsafe(query)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Feedback fetch error:", error)
    return errorResponse("FEEDBACK_FETCH_ERROR", "Failed to fetch feedback", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { service_id, rating, comment, category } = body

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse("INVALID_RATING", "Rating must be between 1 and 5", 400)
    }

    const feedback = await sql`
      INSERT INTO feedback (user_id, service_id, rating, comment, category, status)
      VALUES (${user.id}, ${service_id || null}, ${rating}, ${comment || null}, ${category || 'general'}, 'pending')
      RETURNING id, rating, comment, category, created_at
    `

    return successResponse(feedback[0])
  } catch (error: any) {
    console.error("Feedback creation error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("FEEDBACK_CREATE_ERROR", "Failed to submit feedback", 500)
  }
}
