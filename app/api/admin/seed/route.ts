import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    // Check authorization (optional - can require admin token)
    const auth = request.headers.get("authorization")
    const isLocal = request.headers.get("x-forwarded-for") === "127.0.0.1" || 
                    request.headers.get("host")?.includes("localhost")
    
    if (!isLocal && !auth?.includes("Bearer")) {
      return errorResponse(
        "UNAUTHORIZED",
        "This endpoint is only available locally or with proper authorization",
        401
      )
    }

    // Insert demo users with hashed passwords
    const demoUsers = await sql`
      INSERT INTO users (id, email, full_name, password_hash, role, status, preferred_language, email_verified, created_at, updated_at)
      VALUES 
        (gen_random_uuid(), 'citizen@demo.enav', 'Demo Citizen', crypt('citizen123', gen_salt('bf')), 'citizen', 'active', 'en', true, NOW(), NOW()),
        (gen_random_uuid(), 'employee@demo.enav', 'Demo Employee', crypt('employee123', gen_salt('bf')), 'employee', 'active', 'en', true, NOW(), NOW()),
        (gen_random_uuid(), 'partner@demo.enav', 'Demo Partner', crypt('partner123', gen_salt('bf')), 'partner', 'active', 'en', true, NOW(), NOW()),
        (gen_random_uuid(), 'admin@demo.enav', 'Demo Admin', crypt('admin123', gen_salt('bf')), 'admin', 'active', 'en', true, NOW(), NOW())
      ON CONFLICT DO NOTHING
      RETURNING id, email, role
    `

    // Insert service categories
    const categories = await sql`
      INSERT INTO service_categories (id, name, name_am, name_or, description, icon, sort_order, is_active, created_at)
      VALUES 
        (gen_random_uuid(), 'Business Registration', 'ንግድ ምዝገባ', 'Qaamota Galii', 'Business and enterprise registration services', 'briefcase', 1, true, NOW()),
        (gen_random_uuid(), 'Licensing & Permits', 'ፈቃድ እና ሌሴንስ', 'Digama iyo Laysensa', 'Licenses and permits for businesses', 'scroll', 2, true, NOW()),
        (gen_random_uuid(), 'Tax Services', 'ግብር አገልግሎቶች', 'Alaabta Kabaajiyada', 'Tax filing and payment services', 'calculator', 3, true, NOW()),
        (gen_random_uuid(), 'Identity Services', 'ማንነት አገልግሎቶች', 'Alaabta Aqoonsiga', 'ID and documentation services', 'card', 4, true, NOW()),
        (gen_random_uuid(), 'Education Services', 'ትምህርት አገልግሎቶች', 'Alaabta Waxbarashada', 'Education enrollment and certificates', 'book', 5, true, NOW()),
        (gen_random_uuid(), 'Health Services', 'ጤና አገልግሎቶች', 'Alaabta Caafimaadka', 'Healthcare and medical services', 'heart', 6, true, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `

    // Insert business sectors
    const sectors = await sql`
      INSERT INTO business_sectors (id, name, name_am, name_or, code, description, is_active, created_at)
      VALUES 
        (gen_random_uuid(), 'Technology', 'ቴክኖሎጂ', 'Teknolojiya', 'TECH', 'Information technology sector', true, NOW()),
        (gen_random_uuid(), 'Retail & Commerce', 'ንግድ', 'Ganacsi', 'RETAIL', 'Retail and commerce sector', true, NOW()),
        (gen_random_uuid(), 'Manufacturing', 'ማኑፋክቸር', 'Ururinta', 'MFG', 'Manufacturing sector', true, NOW()),
        (gen_random_uuid(), 'Services', 'አገልግሎቶች', 'Alaabta', 'SRV', 'Professional services sector', true, NOW()),
        (gen_random_uuid(), 'Agriculture', 'ግብርና', 'Waaxbarashada', 'AGR', 'Agriculture and farming sector', true, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `

    // Insert entity types
    const entityTypes = await sql`
      INSERT INTO business_entity_types (id, code, name, name_am, name_or, description, is_active, created_at)
      VALUES 
        (gen_random_uuid(), 'SOLE', 'Sole Proprietorship', 'ነጠላ ሥራ', 'Iskaashi Midkood', 'Individual business owner', true, NOW()),
        (gen_random_uuid(), 'PART', 'Partnership', 'ባልደረባ', 'Iskaashi Wadaag', 'Business partnership', true, NOW()),
        (gen_random_uuid(), 'LLC', 'Limited Liability Company', 'ዝቅተኛ ተጠያቂነት', 'Kampuni Xaddiga Dhamaadka', 'LLC structure', true, NOW()),
        (gen_random_uuid(), 'CORP', 'Corporation', 'ኮርፖሬሽን', 'Kampaaniga', 'Corporate business', true, NOW()),
        (gen_random_uuid(), 'NGO', 'Non-Governmental Organization', 'ፀረ-መንግስታዊ ድርጅት', 'Ururka Halka Joog', 'NGO organization', true, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `

    // Get category ID for services
    const catId = categories.length > 0 ? categories[0].id : null

    // Insert demo services
    const services = await sql`
      INSERT INTO services (id, name, name_am, name_or, description, description_am, category_id, agency, status, online_available, estimated_processing_days, service_fee, created_at, updated_at)
      VALUES 
        (gen_random_uuid(), 'Business Registration', 'ንግድ ምዝገባ', 'Qaamota Galii', 'Register a new business', 'ሥራ ወይም ንግድ ወደ ስኩአር ምዝገባ', ${catId}, 'Trade Office', 'active', true, 7, 500, NOW(), NOW()),
        (gen_random_uuid(), 'Tax Identification Number', 'ግብር መታወቂያ ቁጥር', 'Lambarka Aqoonsiga Kabaajiyada', 'Get a TIN for tax purposes', 'ግብር መታወቂያ ቁጥር ለማግኘት', ${catId}, 'Tax Authority', 'active', true, 3, 0, NOW(), NOW()),
        (gen_random_uuid(), 'Trade License', 'የንግድ ፍቃድ', 'Digama Ganacsi', 'Apply for a trade license', 'የንግድ ፍቃድ ለማግኘት', ${catId}, 'Trade Office', 'active', true, 10, 1000, NOW(), NOW()),
        (gen_random_uuid(), 'Birth Certificate', 'የወለደ ሰርቲፍኬት', 'Shahaadada Dhalka', 'Obtain a birth certificate', 'የወለደ ሰርቲፍኬት ለማግኘት', ${catId}, 'Civil Registry', 'active', true, 5, 50, NOW(), NOW()),
        (gen_random_uuid(), 'School Enrollment', 'የትምህርት ቤት ምዝገባ', 'Qeybinta Dugsi', 'Enroll in school', 'በትምህርት ቤት ውስጥ ምዝገባ', ${catId}, 'Ministry of Education', 'active', true, 2, 0, NOW(), NOW()),
        (gen_random_uuid(), 'Health Insurance', 'የጤና保険', 'Caasimada Caafimaadka', 'Register for health insurance', 'ለጤና保険 ምዝገባ', ${catId}, 'Ministry of Health', 'active', true, 7, 200, NOW(), NOW())
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `

    return successResponse({
      message: "Database seeded successfully",
      stats: {
        demo_users: demoUsers.length,
        service_categories: categories.length,
        business_sectors: sectors.length,
        entity_types: entityTypes.length,
        services: services.length,
      },
      credentials: {
        citizen: { email: "citizen@demo.enav", password: "citizen123" },
        employee: { email: "employee@demo.enav", password: "employee123" },
        partner: { email: "partner@demo.enav", password: "partner123" },
        admin: { email: "admin@demo.enav", password: "admin123" },
      },
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return errorResponse(
      "SEED_ERROR",
      error.message || "Failed to seed database",
      500
    )
  }
}
