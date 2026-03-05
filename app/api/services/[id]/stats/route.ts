import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get application stats by status
    const applications = await sql`
      SELECT status, COUNT(*) as total
      FROM service_requests
      WHERE service_id = ${id}
      GROUP BY status
    `

    // Get feedback/rating stats
    const feedbackStats = await sql`
      SELECT 
        AVG(rating) as avg_rating,
        COUNT(*) as total_feedback
      FROM feedback
      WHERE service_id = ${id}
    `

    // Get recent trends (last 30 days vs previous 30 days)
    const recentApps = await sql`
      SELECT COUNT(*) as count
      FROM service_requests
      WHERE service_id = ${id}
        AND created_at > NOW() - INTERVAL '30 days'
    `

    const previousApps = await sql`
      SELECT COUNT(*) as count
      FROM service_requests
      WHERE service_id = ${id}
        AND created_at > NOW() - INTERVAL '60 days'
        AND created_at <= NOW() - INTERVAL '30 days'
    `

    // Calculate growth rate
    const recent = parseInt(recentApps[0]?.count || 0)
    const previous = parseInt(previousApps[0]?.count || 0)
    const growthRate = previous > 0 ? ((recent - previous) / previous * 100).toFixed(1) : 0

    const stats = {
      applications: applications.map(a => ({
        status: a.status,
        total: parseInt(a.total)
      })),
      avgRating: parseFloat(feedbackStats[0]?.avg_rating || 0),
      totalFeedback: parseInt(feedbackStats[0]?.total_feedback || 0),
      recentApplications: recent,
      growthRate: Number(growthRate),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Service stats fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
