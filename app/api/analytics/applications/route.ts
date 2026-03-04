import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin"])

    // Application status distribution
    const statusDistribution = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM service_requests
      GROUP BY status
    `

    // Applications per day (last 30 days)
    const dailyApplications = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved
      FROM service_requests
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Processing time by service
    const processingTimes = await sql`
      SELECT 
        s.name,
        COUNT(sr.id) as total,
        ROUND(AVG(EXTRACT(EPOCH FROM (sr.updated_at - sr.created_at)) / 86400)::numeric, 1) as avg_days,
        ROUND(MIN(EXTRACT(EPOCH FROM (sr.updated_at - sr.created_at)) / 86400)::numeric, 1) as min_days,
        ROUND(MAX(EXTRACT(EPOCH FROM (sr.updated_at - sr.created_at)) / 86400)::numeric, 1) as max_days
      FROM services s
      LEFT JOIN service_requests sr ON s.id = sr.service_id AND sr.status != 'pending'
      WHERE s.status = 'active'
      GROUP BY s.name
      HAVING COUNT(sr.id) > 0
      ORDER BY avg_days DESC
    `

    // Application conversion funnel
    const funnel = await sql`
      SELECT 
        'submitted' as stage,
        COUNT(*) as count
      FROM service_requests
      WHERE status IN ('submitted', 'submitted_for_review', 'under_review', 'approved', 'issued', 'completed')
      UNION ALL
      SELECT 
        'under_review' as stage,
        COUNT(*) as count
      FROM service_requests
      WHERE status IN ('under_review', 'approved', 'issued', 'completed')
      UNION ALL
      SELECT 
        'approved' as stage,
        COUNT(*) as count
      FROM service_requests
      WHERE status IN ('approved', 'issued', 'completed')
      UNION ALL
      SELECT 
        'completed' as stage,
        COUNT(*) as count
      FROM service_requests
      WHERE status = 'completed'
    `

    return successResponse({
      status_distribution: statusDistribution,
      daily_applications: dailyApplications,
      processing_times: processingTimes,
      conversion_funnel: funnel,
      generated_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Analytics error:", error)
    if (error.message === "FORBIDDEN") {
      return errorResponse("FORBIDDEN", "Admin access required", 403)
    }
    if (error.message === "UNAUTHORIZED") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("ANALYTICS_ERROR", "Failed to fetch analytics", 500)
  }
}
      SELECT 
        'Total Submitted' as stage,
        COUNT(*) as count
      FROM service_requests
      UNION ALL
      SELECT 'Under Review', COUNT(*) FROM service_requests WHERE status = 'under_review'
      UNION ALL
      SELECT 'Approved', COUNT(*) FROM service_requests WHERE status = 'approved'
      UNION ALL
      SELECT 'Rejected', COUNT(*) FROM service_requests WHERE status = 'rejected'
    `

    return NextResponse.json({
      statusDistribution: statusDistribution.map((s: Record<string, unknown>) => ({
        status: s.status,
        count: s.count,
      })),
      dailyApplications: dailyApplications.map((d: Record<string, unknown>) => ({
        date: d.date,
        submitted: d.count,
        approved: d.approved,
      })),
      processingTimes: processingTimes.map((p: Record<string, unknown>) => ({
        service: p.name,
        total: p.total,
        averageDays: p.avg_days,
        minDays: p.min_days,
        maxDays: p.max_days,
      })),
      funnel: funnel.map((f: Record<string, unknown>) => ({
        stage: f.stage,
        count: f.count,
      })),
    })
  } catch (error) {
    console.error("Application analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch application metrics" }, { status: 500 })
  }
}
