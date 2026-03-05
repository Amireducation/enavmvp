import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const requirements = await sql`
      SELECT 
        id,
        requirement_name,
        requirement_name_am,
        requirement_name_or,
        requirement_type,
        is_mandatory,
        description,
        description_am,
        instructions,
        accepted_formats,
        display_order
      FROM service_requirements
      WHERE service_id = ${id} AND is_active = true
      ORDER BY display_order, requirement_name
    `

    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Requirements fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { requirement_name, requirement_type, is_mandatory, description, instructions, accepted_formats } = body

    const newRequirement = await sql`
      INSERT INTO service_requirements (
        service_id, requirement_name, requirement_type, is_mandatory, 
        description, instructions, accepted_formats
      )
      VALUES (
        ${id}, ${requirement_name}, ${requirement_type || 'document'}, 
        ${is_mandatory !== false}, ${description || null}, 
        ${instructions || null}, ${JSON.stringify(accepted_formats || [])}
      )
      RETURNING id, requirement_name, requirement_type, is_mandatory
    `

    return NextResponse.json(newRequirement[0], { status: 201 })
  } catch (error) {
    console.error("Requirement creation error:", error)
    return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 })
  }
}
