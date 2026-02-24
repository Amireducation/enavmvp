import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const services = await sql`
      SELECT s.id as service_id, s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        sc.name as category, s.service_fee,
        s.estimated_processing_days,
        (s.estimated_processing_days || ' business days') as estimated_processing_time,
        s.requirements, s.agency, s.status, s.online_available
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = ${id}
    `
    if (services.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json({ service: services[0] })
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
    const { name, description, service_fee, estimated_processing_days, status } = body

    const updated = await sql`
      UPDATE services SET
        name = COALESCE(${name || null}, name),
        description = COALESCE(${description || null}, description),
        service_fee = COALESCE(${service_fee ?? null}, service_fee),
        estimated_processing_days = COALESCE(${estimated_processing_days ?? null}, estimated_processing_days),
        status = COALESCE(${status || null}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id as service_id, name
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
