import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Service performance metrics
    const serviceMetrics = await sql`
      SELECT 
        s.name,
        s.id,
        COUNT(sr.id) as total_applications,
        COUNT(CASE WHEN sr.status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN sr.status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN sr.status = 'pending' THEN 1 END) as pending_count,
        ROUND(AVG(CAST(f.rating as numeric)), 2) as avg_rating,
        ROUND(COUNT(CASE WHEN sr.status = 'approved' THEN 1 END)::numeric / NULLIF(COUNT(sr.id), 0) * 100, 1) as approval_rate,
        EXTRACT(EPOCH FROM (NOW() - s.created_at)) / 86400 as days_since_launch
      FROM services s
      LEFT JOIN service_requests sr ON s.id = sr.service_id
      LEFT JOIN feedback f ON s.id = f.service_id
      WHERE s.status = 'active'
      GROUP BY s.name, s.id, s.created_at
      ORDER BY total_applications DESC
    `

    return NextResponse.json({
      serviceMetrics: serviceMetrics.map((m: Record<string, unknown>) => ({
        serviceName: m.name,
        serviceId: m.id,
        totalApplications: m.total_applications,
        approved: m.approved_count,
        rejected: m.rejected_count,
        pending: m.pending_count,
        averageRating: m.avg_rating,
        approvalRate: m.approval_rate,
        daysSinceLaunch: m.days_since_launch,
      })),
    })
  } catch (error) {
    console.error("Service analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch service metrics" }, { status: 500 })
  }
}
