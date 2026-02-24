import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

function generateTrackingNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, "0")
  return `ETH-${year}-${random}`
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let applications

    if (user.role === "citizen") {
      applications = await sql`
        SELECT sr.id as application_id, sr.tracking_number, sr.status, sr.priority,
          sr.form_data as submitted_data, sr.reviewer_notes as notes,
          sr.created_at, sr.updated_at, sr.completed_at,
          s.id as service_id, s.name as service_name
        FROM service_requests sr
        JOIN services s ON sr.service_id = s.id
        WHERE sr.user_id = ${user.sub}
        ORDER BY sr.created_at DESC
      `
    } else {
      // Employees and admins see all or assigned
      applications = await sql`
        SELECT sr.id as application_id, sr.tracking_number, sr.status, sr.priority,
          sr.form_data as submitted_data, sr.reviewer_notes as notes,
          sr.created_at, sr.updated_at, sr.completed_at,
          s.id as service_id, s.name as service_name,
          u.full_name as applicant_name, u.email as applicant_email
        FROM service_requests sr
        JOIN services s ON sr.service_id = s.id
        JOIN users u ON sr.user_id = u.id
        ORDER BY sr.created_at DESC
        LIMIT 100
      `
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { service_id, submitted_data } = body

    if (!service_id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const trackingNumber = generateTrackingNumber()

    const application = await sql`
      INSERT INTO service_requests (tracking_number, user_id, service_id, form_data, status)
      VALUES (${trackingNumber}, ${user.sub}, ${service_id}, ${JSON.stringify(submitted_data || {})}, 'submitted')
      RETURNING id as application_id, tracking_number, status, created_at
    `

    // Create notification for the user
    await sql`
      INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
      VALUES (${user.sub}, 'Application Submitted', ${'Your application ' + trackingNumber + ' has been submitted successfully. You can track its progress from your dashboard.'}, 'success', 'service_request', ${application[0].application_id})
    `

    return NextResponse.json({
      application: application[0],
      message: `Application submitted successfully. Tracking number: ${trackingNumber}`,
    }, { status: 201 })
  } catch (error) {
    console.error("Application creation error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
