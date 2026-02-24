import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

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
        COUNT(sr.id) as application_count
      FROM users u
      LEFT JOIN service_requests sr ON u.id = sr.user_id
      WHERE u.role = 'citizen'
      GROUP BY u.id, u.full_name, u.email
      ORDER BY application_count DESC
      LIMIT 10
    `

    return NextResponse.json({
      userStats: userStats.map((s: Record<string, unknown>) => ({
        role: s.role,
        total: s.count,
        active: s.active_count,
        verified: s.verified_count,
      })),
      dailyRegistrations: dailyRegistrations.map((d: Record<string, unknown>) => ({
        date: d.date,
        count: d.count,
      })),
      topUsers: topUsers.map((u: Record<string, unknown>) => ({
        name: u.full_name,
        email: u.email,
        applications: u.application_count,
      })),
    })
  } catch (error) {
    console.error("User analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch user metrics" }, { status: 500 })
  }
}
