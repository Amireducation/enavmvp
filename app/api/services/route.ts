import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const minFee = searchParams.get("minFee")
    const maxFee = searchParams.get("maxFee")

    let services

    if (search || category || minFee || maxFee) {
      services = await sql`
        SELECT s.id as service_id, s.name, s.name_am, s.name_or,
          s.description, s.description_am, s.description_or,
          sc.name as category, s.service_fee,
          s.estimated_processing_days,
          (s.estimated_processing_days || ' business days') as estimated_processing_time,
          s.requirements, s.agency, s.agency as responsible_agency, s.status, s.online_available
        FROM services s
        LEFT JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.status = 'active'
          AND (${search}::text IS NULL OR s.name ILIKE '%' || ${search} || '%' OR s.description ILIKE '%' || ${search} || '%')
          AND (${category}::text IS NULL OR sc.name = ${category})
          AND (${minFee}::numeric IS NULL OR s.service_fee >= ${minFee}::numeric)
          AND (${maxFee}::numeric IS NULL OR s.service_fee <= ${maxFee}::numeric)
        ORDER BY s.name
      `
    } else {
      services = await sql`
        SELECT s.id as service_id, s.name, s.name_am, s.name_or,
          s.description, s.description_am, s.description_or,
          sc.name as category, s.service_fee,
          s.estimated_processing_days,
          (s.estimated_processing_days || ' business days') as estimated_processing_time,
          s.requirements, s.agency, s.agency as responsible_agency, s.status, s.online_available
        FROM services s
        LEFT JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.status = 'active'
        ORDER BY s.name
      `
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Services fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "employee"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { name, name_am, description, description_am, category_id, service_fee, estimated_processing_days, agency, requirements } = body

    const newService = await sql`
      INSERT INTO services (name, name_am, description, description_am, category_id, service_fee, estimated_processing_days, agency, requirements, created_by)
      VALUES (${name}, ${name_am || null}, ${description}, ${description_am || null}, ${category_id || null}, ${service_fee || 0}, ${estimated_processing_days || 7}, ${agency || null}, ${JSON.stringify(requirements || [])}, ${user.sub})
      RETURNING id as service_id, name, description
    `

    return NextResponse.json({ service: newService[0] }, { status: 201 })
  } catch (error) {
    console.error("Service creation error:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
