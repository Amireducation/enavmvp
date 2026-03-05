import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const variations = await sql`
      SELECT 
        id,
        variation_name,
        variation_name_am,
        variation_name_or,
        variation_type,
        description,
        fee_adjustment_percentage,
        processing_days_min,
        processing_days_max,
        delivery_method,
        is_available
      FROM service_variations
      WHERE service_id = ${id} AND is_available = true
      ORDER BY variation_name
    `

    return NextResponse.json(variations)
  } catch (error) {
    console.error("Variations fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch variations" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      variation_name, variation_type, description, 
      fee_adjustment_percentage, processing_days_min, processing_days_max, delivery_method 
    } = body

    const newVariation = await sql`
      INSERT INTO service_variations (
        service_id, variation_name, variation_type, description,
        fee_adjustment_percentage, processing_days_min, processing_days_max, delivery_method
      )
      VALUES (
        ${id}, ${variation_name}, ${variation_type || 'standard'}, ${description || null},
        ${fee_adjustment_percentage || 0}, ${processing_days_min || 5}, ${processing_days_max || 14}, ${delivery_method || 'in_person'}
      )
      RETURNING id, variation_name, variation_type
    `

    return NextResponse.json(newVariation[0], { status: 201 })
  } catch (error) {
    console.error("Variation creation error:", error)
    return NextResponse.json({ error: "Failed to create variation" }, { status: 500 })
  }
}
