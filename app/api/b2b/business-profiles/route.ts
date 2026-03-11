import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, requireRole, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit
    const status = searchParams.get("status")
    const sector = searchParams.get("sector")
    const search = searchParams.get("search")

    // Build query based on user role
    let whereClause = ""
    const conditions: string[] = []

    // Citizens can only see their own business profiles
    if (user.role === "citizen") {
      conditions.push(`bp.user_id = '${user.id}'`)
    }
    
    // Filter by verification status
    if (status) {
      conditions.push(`bp.verification_status = '${status}'`)
    }
    
    // Filter by sector
    if (sector) {
      conditions.push(`bs.code = '${sector}'`)
    }
    
    // Search by business name
    if (search) {
      conditions.push(`(bp.business_name ILIKE '%${search}%' OR bp.business_name_am ILIKE '%${search}%' OR bp.tin ILIKE '%${search}%')`)
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ")
    }

    // Get total count
    const countResult = await sql.unsafe(`
      SELECT COUNT(*) as total 
      FROM business_profiles bp
      LEFT JOIN business_sectors bs ON bp.sector_id = bs.id
      ${whereClause}
    `)
    const total = parseInt(countResult[0].total)

    // Get paginated business profiles
    const profiles = await sql.unsafe(`
      SELECT 
        bp.id,
        bp.business_name,
        bp.business_name_am,
        bp.business_description,
        bp.business_type,
        bp.registration_number,
        bp.tin,
        bp.trade_license_number,
        bp.trade_license_expiry,
        bp.email,
        bp.phone,
        bp.address,
        bp.website,
        bp.logo_url,
        bp.number_of_employees,
        bp.annual_revenue,
        bp.verification_status,
        bp.verified_at,
        bp.rejection_reason,
        bp.created_at,
        bp.updated_at,
        bs.name as sector_name,
        bs.code as sector_code,
        bet.name as entity_type_name,
        u.full_name as owner_name,
        u.email as owner_email
      FROM business_profiles bp
      LEFT JOIN business_sectors bs ON bp.sector_id = bs.id
      LEFT JOIN business_entity_types bet ON bp.entity_type_id = bet.id
      LEFT JOIN users u ON bp.user_id = u.id
      ${whereClause}
      ORDER BY bp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return paginatedResponse(
      profiles.map((p: any) => ({
        id: p.id,
        businessName: p.business_name,
        businessNameAm: p.business_name_am,
        description: p.business_description,
        businessType: p.business_type,
        registrationNumber: p.registration_number,
        tin: p.tin,
        tradeLicenseNumber: p.trade_license_number,
        tradeLicenseExpiry: p.trade_license_expiry,
        email: p.email,
        phone: p.phone,
        address: p.address,
        website: p.website,
        logoUrl: p.logo_url,
        employees: p.number_of_employees,
        annualRevenue: p.annual_revenue,
        verificationStatus: p.verification_status,
        verifiedAt: p.verified_at,
        rejectionReason: p.rejection_reason,
        sector: {
          name: p.sector_name,
          code: p.sector_code,
        },
        entityType: p.entity_type_name,
        owner: {
          name: p.owner_name,
          email: p.owner_email,
        },
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })),
      page,
      limit,
      total
    )
  } catch (error: any) {
    console.error("Business profiles fetch error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("FETCH_ERROR", "Failed to fetch business profiles", 500)
  }
}

export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()

    const {
      businessName,
      businessNameAm,
      businessDescription,
      businessType,
      registrationNumber,
      tin,
      tradeLicenseNumber,
      tradeLicenseExpiry,
      email,
      phone,
      address,
      website,
      sectorId,
      entityTypeId,
      numberOfEmployees,
      annualRevenue,
    } = body

    // Validation
    if (!businessName) {
      return errorResponse("INVALID_INPUT", "Business name is required", 400)
    }
    if (!tin) {
      return errorResponse("INVALID_INPUT", "TIN (Tax Identification Number) is required", 400)
    }
    if (!email) {
      return errorResponse("INVALID_INPUT", "Business email is required", 400)
    }

    // Check if TIN already exists
    const existingTin = await sql`
      SELECT id FROM business_profiles WHERE tin = ${tin}
    `
    if (existingTin.length > 0) {
      return errorResponse("DUPLICATE_TIN", "A business with this TIN already exists", 400)
    }

    // Create business profile
    const newProfile = await sql`
      INSERT INTO business_profiles (
        user_id,
        business_name,
        business_name_am,
        business_description,
        business_type,
        registration_number,
        tin,
        trade_license_number,
        trade_license_expiry,
        email,
        phone,
        address,
        website,
        sector_id,
        entity_type_id,
        number_of_employees,
        annual_revenue,
        verification_status,
        is_active
      ) VALUES (
        ${user.id},
        ${businessName},
        ${businessNameAm || null},
        ${businessDescription || null},
        ${businessType || 'private'},
        ${registrationNumber || null},
        ${tin},
        ${tradeLicenseNumber || null},
        ${tradeLicenseExpiry || null},
        ${email},
        ${phone || null},
        ${address || null},
        ${website || null},
        ${sectorId || null},
        ${entityTypeId || null},
        ${numberOfEmployees || null},
        ${annualRevenue || null},
        'pending',
        true
      )
      RETURNING id, business_name, verification_status, created_at
    `

    // Log audit
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'create', 'business_profile', ${newProfile[0].id}, ${JSON.stringify(body)})
    `

    return successResponse({
      id: newProfile[0].id,
      businessName: newProfile[0].business_name,
      verificationStatus: newProfile[0].verification_status,
      message: "Business profile created successfully. It will be reviewed for verification.",
      createdAt: newProfile[0].created_at,
    })
  } catch (error: any) {
    console.error("Business profile creation error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    return errorResponse("CREATE_ERROR", "Failed to create business profile", 500)
  }
}
