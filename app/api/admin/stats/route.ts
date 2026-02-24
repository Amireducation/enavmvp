import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const [userCount, serviceCount, requestCount, feedbackStats, recentUsers, recentFeedback] = await Promise.all([
      sql`SELECT count(*) as total FROM users`,
      sql`SELECT count(*) as total FROM services WHERE status = 'active'`,
      sql`SELECT count(*) as total FROM service_requests`,
      sql`SELECT COALESCE(AVG(rating), 0) as avg_rating, count(*) as total FROM feedback`,
      sql`SELECT id, email, full_name as name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT f.id, u.full_name as user_name, s.name as service_name, f.rating, f.comment, f.created_at
          FROM feedback f
          LEFT JOIN users u ON f.user_id = u.id
          LEFT JOIN services s ON f.service_id = s.id
          ORDER BY f.created_at DESC LIMIT 5`,
    ])

    return NextResponse.json({
      stats: {
        totalUsers: parseInt(userCount[0].total),
        totalServices: parseInt(serviceCount[0].total),
        totalApplications: parseInt(requestCount[0].total),
        citizenSatisfaction: parseFloat(feedbackStats[0].avg_rating).toFixed(1),
        uptime: "99.97%",
      },
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name || u.email,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
      })),
      recentFeedback: recentFeedback.map((f) => ({
        id: f.id,
        user: f.user_name || "Anonymous",
        service: f.service_name || "General",
        rating: f.rating,
        comment: f.comment || "",
        date: new Date(f.created_at).toLocaleDateString(),
      })),
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
