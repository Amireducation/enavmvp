const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_CONN_STRING || "postgresql://postgres:postgres@localhost:5432/ethiopian_navigator",
})

async function seedServices() {
  console.log("\nSeeding services...")

  try {
    // Check if services already exist
    const checkResult = await pool.query("SELECT COUNT(*) FROM services")
    if (Number.parseInt(checkResult.rows[0].count) > 0) {
      console.log("Services already exist. Skipping service seed.")
      return
    }

    // Load seed data
    const seedDataPath = path.join(__dirname, "../data/services.seed.json")
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"))

    let count = 0
    for (const service of seedData.services) {
      await pool.query(
        `INSERT INTO services (service_id, category, name, description, responsible_agency, 
         estimated_processing_time, service_fee, requirements, is_archived)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          service.service_id,
          service.category,
          service.name,
          service.description,
          service.responsible_agency,
          service.estimated_processing_time,
          service.service_fee,
          service.requirements || [],
          service.is_archived || false,
        ],
      )
      count++
    }

    console.log(`✓ Seeded ${count} services`)
  } catch (error) {
    console.error("Service seeding failed:", error.message)
    throw error
  }
}

async function seedUsers() {
  console.log("\nSeeding users...")

  try {
    const users = [
      {
        email: "admin@ethiopiannavigator.gov.et",
        password: "Admin123!",
        role: "admin",
        full_name: "System Administrator",
        phone: "+251911000000",
      },
      {
        email: "employee@ethiopiannavigator.gov.et",
        password: "Employee123!",
        role: "employee",
        full_name: "Government Employee",
        phone: "+251911000001",
      },
      {
        email: "partner@ethiopiannavigator.gov.et",
        password: "Partner123!",
        role: "partner",
        full_name: "Partner Organization",
        phone: "+251911000002",
      },
      {
        email: "citizen@example.com",
        password: "Citizen123!",
        role: "citizen",
        full_name: "Test Citizen",
        phone: "+251911000003",
      },
    ]

    let count = 0
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10)

      const result = await pool.query(
        `INSERT INTO users (email, password, role, full_name, phone) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.email, hashedPassword, user.role, user.full_name, user.phone],
      )

      if (result.rows.length > 0) {
        // Create user profile
        await pool.query(
          `INSERT INTO user_profiles (user_id, full_name, phone, language_preference)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id) DO NOTHING`,
          [result.rows[0].id, user.full_name, user.phone, "en"],
        )
        count++
      }
    }

    console.log(`✓ Seeded ${count} users with profiles`)
    console.log("\nDefault User Credentials:")
    console.log("-------------------------")
    users.forEach((user) => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
  } catch (error) {
    console.error("User seeding failed:", error.message)
    throw error
  }
}

async function seedSampleApplications() {
  console.log("\nSeeding sample applications...")

  try {
    // Get citizen user
    const userResult = await pool.query("SELECT id FROM users WHERE role = 'citizen' LIMIT 1")
    if (userResult.rows.length === 0) {
      console.log("No citizen user found. Skipping sample applications.")
      return
    }

    const userId = userResult.rows[0].id

    // Get some services
    const servicesResult = await pool.query("SELECT service_id FROM services LIMIT 3")
    if (servicesResult.rows.length === 0) {
      console.log("No services found. Skipping sample applications.")
      return
    }

    const statuses = ["submitted", "under_review", "approved"]
    let count = 0

    for (let i = 0; i < servicesResult.rows.length; i++) {
      const serviceId = servicesResult.rows[i].service_id
      const status = statuses[i % statuses.length]

      await pool.query(
        `INSERT INTO applications (application_id, user_id, service_id, status, submitted_data)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          `app_sample_${Date.now()}_${i}`,
          userId,
          serviceId,
          status,
          JSON.stringify({
            applicant_name: "Test Citizen",
            contact_phone: "+251911000003",
            notes: "Sample application for testing",
          }),
        ],
      )
      count++
    }

    console.log(`✓ Seeded ${count} sample applications`)
  } catch (error) {
    console.error("Application seeding failed:", error.message)
    throw error
  }
}

async function main() {
  console.log("=== Comprehensive Database Seeding ===\n")

  try {
    await seedServices()
    await seedUsers()
    await seedSampleApplications()

    console.log("\n=== Seeding Complete ===")
  } catch (error) {
    console.error("\nSeeding failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  main()
}

module.exports = { seedServices, seedUsers, seedSampleApplications }
