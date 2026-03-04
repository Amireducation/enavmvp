import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"

/**
 * GET /api/services/g2b/[id]
 * Detailed G2B Service Information
 * Includes: requirements, fees, variations, and business applicability
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get main service info
    const services = await sql`
      SELECT 
        s.id,
        s.name, s.name_am, s.name_or,
        s.description, s.description_am, s.description_or,
        s.service_code,
        s.target_audience,
        sc.id as category_id, sc.name as category, sc.name_am as category_am,
        bs.id as sector_id, bs.code as sector_code, bs.name as sector_name, bs.name_am as sector_name_am,
        s.service_fee,
        s.min_processing_days,
        s.max_processing_days,
        s.estimated_processing_days,
        s.online_available,
        s.is_renewable,
        s.renewal_period_months,
        s.validity_period_months,
        s.agency,
        s.department,
        s.legal_basis,
        s.legal_basis_am,
        s.status,
        s.created_at,
        s.updated_at
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      LEFT JOIN business_sectors bs ON s.sector_id = bs.id
      WHERE s.id = ${id} AND s.status = 'active'
    `

    if (services.length === 0) {
      return errorResponse("SERVICE_NOT_FOUND", "Service not found", 404)
    }

    const service = services[0]

    // Get service requirements
    const requirements = await sql`
      SELECT id, requirement_name, requirement_name_am, requirement_type, is_mandatory, description, description_am
      FROM service_requirements
      WHERE service_id = ${id} AND is_active = TRUE
      ORDER BY is_mandatory DESC, requirement_name ASC
    `

    // Get service fees
    const fees = await sql`
      SELECT 
        id, fee_type, fee_name, fee_name_am, amount, currency, 
        is_mandatory, description, description_am
      FROM service_fees
      WHERE service_id = ${id} AND is_active = TRUE
      ORDER BY fee_name ASC
    `

    // Get eligible business entity types
    let eligibleEntityTypes: any[] = []
    if (service.required_entity_types) {
      eligibleEntityTypes = await sql.unsafe(
        `SELECT id, code, name, name_am, description FROM business_entity_types 
         WHERE code = ANY($1::text[]) AND is_active = TRUE`,
        [service.required_entity_types]
      )
    }

    // Get service variations (if any)
    const variations = await sql`
      SELECT 
        id, variation_type, variation_name, variation_name_am,
        processing_days_min, processing_days_max,
        fee_adjustment_percentage, delivery_method, description, is_available
      FROM service_variations
      WHERE service_id = ${id} AND is_available = TRUE
      ORDER BY variation_name ASC
    `

    return successResponse({
      service: {
        ...service,
        requirements: requirements.length > 0 ? requirements : [],
        fees: fees.length > 0 ? fees : [],
        variations: variations.length > 0 ? variations : [],
        eligible_entity_types: eligibleEntityTypes,
        total_base_fee: fees.reduce((sum: number, f: any) => sum + (f.is_mandatory ? f.amount : 0), 0)
      }
    })
  } catch (error) {
    console.error("G2B service detail error:", error)
    return errorResponse("SERVICE_DETAIL_ERROR", "Failed to fetch service details", 500)
  }
}
