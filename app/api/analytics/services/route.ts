import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin"])

    // Service performance metrics
    const serviceMetrics = await sql`
      SELECT 
        s.name,
        s.id,
        COUNT(sr.id) as total_applications,
        COUNT(CASE WHEN sr.status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN sr.status = 'rejected' THEN 1 END) as rejected_count,
        ROUND(AVG(CAST(f.rating as numeric)), 2) as avg_rating,
        ROUND(COUNT(CASE WHEN sr.status = 'approved' THEN 1 END)::numeric / NULLIF(COUNT(sr.id), 0) * 100, 1) as approval_rate
      FROM services s
      LEFT JOIN service_requests sr ON s.id = sr.service_id
      LEFT JOIN feedback f ON s.id = f.service_id
      WHERE s.status = 'active'
      GROUP BY s.name, s.id
      ORDER BY total_applications DESC
    `

    return successResponse({
      services: serviceMetrics.map((m: any) => ({
        id: m.id,
        name: m.name,
        total_applications: m.total_applications,
        approved: m.approved_count,
        rejected: m.rejected_count,
        average_rating: m.avg_rating,
        approval_rate: m.approval_rate,
      })),
    })
  } catch (error: any) {
    console.error("Services analytics error:", error)
    if (error.message === "FORBIDDEN") {
      return errorResponse("FORBIDDEN", "Admin access required", 403)
    }
    return errorResponse("ANALYTICS_ERROR", "Failed to fetch service analytics", 500)
  }
}
