import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin"])

    // User statistics
    const userStats = await sql`
      SELECT 
        role,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_count
      FROM users
      GROUP BY role
    `

    // Daily registrations (last 30 days)
    const dailyRegistrations = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Top users by applications
    const topUsers = await sql`
      SELECT 
        u.full_name,
        u.email,
        u.role,
        COUNT(sr.id) as application_count
      FROM users u
      LEFT JOIN service_requests sr ON u.id = sr.user_id
      GROUP BY u.id, u.full_name, u.email, u.role
      HAVING COUNT(sr.id) > 0
      ORDER BY application_count DESC
      LIMIT 10
    `

    return successResponse({
      user_stats: userStats,
      daily_registrations: dailyRegistrations,
      top_users: topUsers,
    })
  } catch (error: any) {
    console.error("Users analytics error:", error)
    if (error.message === "FORBIDDEN") {
      return errorResponse("FORBIDDEN", "Admin access required", 403)
    }
    return errorResponse("ANALYTICS_ERROR", "Failed to fetch user analytics", 500)
  }
}
