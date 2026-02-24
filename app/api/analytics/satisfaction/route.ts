import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Overall satisfaction
    const overallStats = await sql`
      SELECT 
        COUNT(*) as total_feedback,
        ROUND(AVG(rating)::numeric, 2) as avg_rating,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as satisfied_count,
        ROUND(COUNT(CASE WHEN rating >= 4 THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 1) as satisfaction_rate
      FROM feedback
    `

    // Rating distribution
    const ratingDistribution = await sql`
      SELECT 
        rating,
        COUNT(*) as count
      FROM feedback
      GROUP BY rating
      ORDER BY rating ASC
    `

    // Feedback by service
    const feedbackByService = await sql`
      SELECT 
        s.name,
        COUNT(f.id) as feedback_count,
        ROUND(AVG(f.rating)::numeric, 2) as avg_rating
      FROM services s
      LEFT JOIN feedback f ON s.id = f.service_id
      WHERE s.status = 'active'
      GROUP BY s.name
      HAVING COUNT(f.id) > 0
      ORDER BY avg_rating DESC
    `

    // Recent feedback with sentiment
    const recentFeedback = await sql`
      SELECT 
        f.id,
        u.full_name,
        s.name as service_name,
        f.rating,
        f.comment,
        f.created_at
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN services s ON f.service_id = s.id
      ORDER BY f.created_at DESC
      LIMIT 20
    `

    return NextResponse.json({
      overallStats: {
        totalFeedback: overallStats[0].total_feedback,
        averageRating: overallStats[0].avg_rating,
        satisfiedCount: overallStats[0].satisfied_count,
        satisfactionRate: overallStats[0].satisfaction_rate,
      },
      ratingDistribution: ratingDistribution.map((r: Record<string, unknown>) => ({
        rating: r.rating,
        count: r.count,
      })),
      feedbackByService: feedbackByService.map((f: Record<string, unknown>) => ({
        service: f.name,
        feedbackCount: f.feedback_count,
        averageRating: f.avg_rating,
      })),
      recentFeedback: recentFeedback.map((f: Record<string, unknown>) => ({
        id: f.id,
        userName: f.full_name,
        service: f.service_name,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.created_at,
      })),
    })
  } catch (error) {
    console.error("Satisfaction analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch satisfaction metrics" }, { status: 500 })
  }
}
