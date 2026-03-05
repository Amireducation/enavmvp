import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

interface ServiceDetail {
  id: string
  name: string
  name_am: string
  name_or: string
  description: string
  description_am: string
  description_or: string
  category: string
  category_id: string
  service_fee: number
  estimated_processing_days: number
  online_available: boolean
  agency: string
  contact_email: string
  contact_phone: string
  requirements: string[]
  status: string
  // Enhanced fields
  created_at: string
  updated_at: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get detailed service information
    const services = await sql`
      SELECT 
        s.id,
        s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        sc.id as category_id, sc.name as category,
        s.service_fee,
        s.estimated_processing_days,
        s.online_available,
        s.agency,
        s.contact_email,
        s.contact_phone,
        s.requirements,
        s.status,
        s.created_at,
        s.updated_at
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = ${id}
    `

    if (services.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = services[0]

    // Get related services from the same category
    const relatedServices = await sql`
      SELECT s.id, s.name, s.description
      FROM services s
      WHERE s.category_id = ${service.category_id}
        AND s.id != ${id}
        AND s.status = 'active'
      LIMIT 5
    `

    // Get service reviews and ratings
    const reviews = await sql`
      SELECT 
        AVG(CAST(rating as FLOAT)) as avg_rating,
        COUNT(*) as review_count
      FROM service_feedback
      WHERE service_id = ${id}
    `

    // Get FAQs related to this service
    const faqs = await sql`
      SELECT question, question_am, question_or, answer, answer_am, answer_or
      FROM faqs
      WHERE category ILIKE '%' || $1 || '%'
        AND status = 'active'
      LIMIT 5
    `

    const response: any = {
      service: {
        id: service.id,
        name: service.name,
        name_am: service.name_am,
        name_or: service.name_or,
        description: service.description,
        description_am: service.description_am,
        description_or: service.description_or,
        category: service.category,
        category_id: service.category_id,
        service_fee: Number(service.service_fee),
        estimated_processing_days: Number(service.estimated_processing_days),
        estimated_processing_time: `${service.estimated_processing_days} business days`,
        online_available: service.online_available,
        agency: service.agency,
        contact_email: service.contact_email,
        contact_phone: service.contact_phone,
        requirements: Array.isArray(service.requirements) ? service.requirements : [],
        status: service.status,
        created_at: service.created_at,
        updated_at: service.updated_at,
      },
      relatedServices: relatedServices.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
      })),
      ratings: {
        average: reviews[0]?.avg_rating ? parseFloat(reviews[0].avg_rating).toFixed(1) : "N/A",
        totalReviews: Number(reviews[0]?.review_count || 0),
      },
      faqs: faqs.map((f: any) => ({
        question: f.question,
        question_am: f.question_am,
        question_or: f.question_or,
        answer: f.answer,
        answer_am: f.answer_am,
        answer_or: f.answer_or,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Service fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { 
      name, name_am, description, description_am,
      service_fee, estimated_processing_days, min_processing_days, max_processing_days,
      status, agency, online_available, target_audience,
      contact_email, contact_phone, requirements
    } = body

    const updated = await sql`
      UPDATE services SET
        name = COALESCE(${name || null}, name),
        name_am = COALESCE(${name_am || null}, name_am),
        description = COALESCE(${description || null}, description),
        description_am = COALESCE(${description_am || null}, description_am),
        service_fee = COALESCE(${service_fee ?? null}, service_fee),
        estimated_processing_days = COALESCE(${estimated_processing_days ?? null}, estimated_processing_days),
        min_processing_days = COALESCE(${min_processing_days ?? null}, min_processing_days),
        max_processing_days = COALESCE(${max_processing_days ?? null}, max_processing_days),
        status = COALESCE(${status || null}, status),
        agency = COALESCE(${agency || null}, agency),
        online_available = COALESCE(${online_available ?? null}, online_available),
        target_audience = COALESCE(${target_audience || null}, target_audience),
        contact_email = COALESCE(${contact_email || null}, contact_email),
        contact_phone = COALESCE(${contact_phone || null}, contact_phone),
        requirements = COALESCE(${requirements ? JSON.stringify(requirements) : null}, requirements),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, status
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ service: updated[0] })
  } catch (error) {
    console.error("Service update error:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    await sql`UPDATE services SET status = 'deprecated' WHERE id = ${id}`
    return NextResponse.json({ message: "Service deleted" })
  } catch (error) {
    console.error("Service delete error:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
