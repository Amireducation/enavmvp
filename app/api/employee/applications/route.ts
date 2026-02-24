import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["employee", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const applications = await sql`
      SELECT sr.id as application_id,
        sr.tracking_number as id,
        s.name as service,
        u.full_name as applicant,
        u.email,
        sr.status,
        sr.priority,
        sr.created_at as submitted,
        sr.notes
      FROM service_requests sr
      LEFT JOIN services s ON sr.service_id = s.id
      LEFT JOIN users u ON sr.user_id = u.id
      WHERE (${status}::text IS NULL OR sr.status = ${status})
      ORDER BY
        CASE sr.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
        sr.created_at DESC
      LIMIT 50
    `

    const stats = await sql`
      SELECT
        count(*) FILTER (WHERE status = 'pending') as pending,
        count(*) FILTER (WHERE status = 'under_review') as under_review,
        count(*) FILTER (WHERE status = 'approved') as approved,
        count(*) FILTER (WHERE status IN ('approved', 'rejected') AND updated_at >= CURRENT_DATE) as today_processed
      FROM service_requests
    `

    return NextResponse.json({
      applications: applications.map((a) => ({
        ...a,
        id: a.id || `APP-${a.application_id}`,
        submitted: new Date(a.submitted).toISOString().split("T")[0],
        priority: a.priority || "normal",
      })),
      stats: {
        pending: parseInt(stats[0].pending),
        underReview: parseInt(stats[0].under_review),
        approved: parseInt(stats[0].approved),
        todayProcessed: parseInt(stats[0].today_processed),
      },
    })
  } catch (error) {
    console.error("Employee applications error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
