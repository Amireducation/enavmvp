import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireRole(request, ["admin"])
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30days"
    
    // Calculate date range based on period
    let dateFilter = "30"
    switch (period) {
      case "7days": dateFilter = "7"; break
      case "30days": dateFilter = "30"; break
      case "90days": dateFilter = "90"; break
      case "yearly": dateFilter = "365"; break
    }

    // Fetch comprehensive analytics in parallel
    const [
      userStats,
      serviceStats,
      requestStats,
      revenueStats,
      topServices,
      requestsByStatus,
      userGrowth,
      requestTrends,
      avgProcessingTime,
      feedbackStats,
      categoryDistribution,
      hourlyActivity
    ] = await Promise.all([
      // User statistics
      sql`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'citizen' THEN 1 END) as citizens,
          COUNT(CASE WHEN role = 'employee' THEN 1 END) as employees,
          COUNT(CASE WHEN role = 'partner' THEN 1 END) as partners,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '${dateFilter} days' THEN 1 END) as new_users,
          COUNT(CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_weekly
        FROM users
        WHERE status = 'active'
      `,
      
      // Service statistics
      sql`
        SELECT 
          COUNT(*) as total_services,
          COUNT(CASE WHEN online_available = true THEN 1 END) as online_services,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_services,
          AVG(service_fee) as avg_fee,
          AVG(estimated_processing_days) as avg_processing_days
        FROM services
      `,
      
      // Request statistics
      sql`
        SELECT 
          COUNT(*) as total_requests,
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '${dateFilter} days' THEN 1 END) as recent_requests
        FROM service_requests
      `,
      
      // Revenue statistics from payment records
      sql`
        SELECT 
          COALESCE(SUM(amount), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN created_at > NOW() - INTERVAL '${dateFilter} days' THEN amount ELSE 0 END), 0) as period_revenue,
          COUNT(*) as total_payments,
          AVG(amount) as avg_payment
        FROM payment_records
        WHERE payment_status = 'completed'
      `,
      
      // Top services by request count
      sql`
        SELECT 
          s.name,
          s.name_am,
          COUNT(sr.id) as request_count,
          s.service_fee,
          s.estimated_processing_days
        FROM services s
        LEFT JOIN service_requests sr ON s.id = sr.service_id
        WHERE s.status = 'active'
        GROUP BY s.id, s.name, s.name_am, s.service_fee, s.estimated_processing_days
        ORDER BY request_count DESC
        LIMIT 10
      `,
      
      // Requests by status for pie chart
      sql`
        SELECT status, COUNT(*) as count
        FROM service_requests
        GROUP BY status
      `,
      
      // User growth over time (last 6 months)
      sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
          COUNT(*) as users
        FROM users
        WHERE created_at > NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
      `,
      
      // Request trends over time (last 6 months)
      sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
          COUNT(*) as requests,
          COUNT(CASE WHEN status IN ('approved', 'completed') THEN 1 END) as completed
        FROM service_requests
        WHERE created_at > NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
      `,
      
      // Average processing time
      sql`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/86400) as avg_days
        FROM service_requests
        WHERE completed_at IS NOT NULL AND status IN ('approved', 'completed')
      `,
      
      // Feedback statistics
      sql`
        SELECT 
          COUNT(*) as total_feedback,
          COALESCE(AVG(rating), 0) as avg_rating,
          COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive,
          COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative
        FROM feedback
      `,
      
      // Category distribution
      sql`
        SELECT 
          sc.name as category,
          COUNT(s.id) as service_count,
          COUNT(sr.id) as request_count
        FROM service_categories sc
        LEFT JOIN services s ON sc.id = s.category_id
        LEFT JOIN service_requests sr ON s.id = sr.service_id
        WHERE sc.is_active = true
        GROUP BY sc.id, sc.name
        ORDER BY request_count DESC
        LIMIT 8
      `,
      
      // Hourly activity pattern (last 7 days)
      sql`
        SELECT 
          EXTRACT(HOUR FROM created_at) as hour,
          COUNT(*) as activity
        FROM service_requests
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY EXTRACT(HOUR FROM created_at)
        ORDER BY hour
      `
    ])

    // Calculate metrics
    const totalRequests = parseInt(requestStats[0]?.total_requests || 0)
    const completedRequests = parseInt(requestStats[0]?.completed || 0) + parseInt(requestStats[0]?.approved || 0)
    const completionRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : "0.0"

    // Format response
    return successResponse({
      overview: {
        totalUsers: parseInt(userStats[0]?.total_users || 0),
        newUsers: parseInt(userStats[0]?.new_users || 0),
        activeWeekly: parseInt(userStats[0]?.active_weekly || 0),
        totalServices: parseInt(serviceStats[0]?.total_services || 0),
        activeServices: parseInt(serviceStats[0]?.active_services || 0),
        onlineServices: parseInt(serviceStats[0]?.online_services || 0),
        totalRequests: totalRequests,
        recentRequests: parseInt(requestStats[0]?.recent_requests || 0),
        completionRate: parseFloat(completionRate),
        avgProcessingDays: parseFloat(avgProcessingTime[0]?.avg_days || 0).toFixed(1),
        totalRevenue: parseFloat(revenueStats[0]?.total_revenue || 0),
        periodRevenue: parseFloat(revenueStats[0]?.period_revenue || 0),
        avgRating: parseFloat(feedbackStats[0]?.avg_rating || 0).toFixed(1),
        totalFeedback: parseInt(feedbackStats[0]?.total_feedback || 0),
      },
      userBreakdown: {
        citizens: parseInt(userStats[0]?.citizens || 0),
        employees: parseInt(userStats[0]?.employees || 0),
        partners: parseInt(userStats[0]?.partners || 0),
        admins: parseInt(userStats[0]?.admins || 0),
      },
      requestsByStatus: {
        submitted: parseInt(requestStats[0]?.submitted || 0),
        processing: parseInt(requestStats[0]?.processing || 0),
        approved: parseInt(requestStats[0]?.approved || 0),
        completed: parseInt(requestStats[0]?.completed || 0),
        rejected: parseInt(requestStats[0]?.rejected || 0),
      },
      topServices: topServices.map((s: any) => ({
        name: s.name,
        nameAm: s.name_am,
        requestCount: parseInt(s.request_count),
        fee: parseFloat(s.service_fee || 0),
        processingDays: parseInt(s.estimated_processing_days || 0),
      })),
      statusDistribution: requestsByStatus.map((s: any) => ({
        name: s.status,
        value: parseInt(s.count),
      })),
      userGrowth: userGrowth.map((u: any) => ({
        month: u.month,
        users: parseInt(u.users),
      })),
      requestTrends: requestTrends.map((r: any) => ({
        month: r.month,
        requests: parseInt(r.requests),
        completed: parseInt(r.completed),
      })),
      categoryDistribution: categoryDistribution.map((c: any) => ({
        category: c.category,
        services: parseInt(c.service_count),
        requests: parseInt(c.request_count),
      })),
      hourlyActivity: hourlyActivity.map((h: any) => ({
        hour: parseInt(h.hour),
        activity: parseInt(h.activity),
      })),
      feedbackSummary: {
        avgRating: parseFloat(feedbackStats[0]?.avg_rating || 0).toFixed(1),
        total: parseInt(feedbackStats[0]?.total_feedback || 0),
        positive: parseInt(feedbackStats[0]?.positive || 0),
        negative: parseInt(feedbackStats[0]?.negative || 0),
      },
      period: period,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Analytics error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    if (error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Admin access required", 403)
    }
    return errorResponse("ANALYTICS_ERROR", "Failed to fetch analytics", 500)
  }
}
