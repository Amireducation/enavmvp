const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_CONN_STRING || "postgresql://postgres:postgres@localhost:5432/ethiopian_navigator",
})

async function runMigrations() {
  console.log("Running database migrations...")

  try {
    // Read and execute migration files in order
    const migrationsDir = path.join(__dirname, "../migrations")
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort()

    for (const file of files) {
      console.log(`Executing migration: ${file}`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8")
      await pool.query(sql)
      console.log(`✓ ${file} completed`)
    }

    console.log("All migrations completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    throw error
  }
}

async function seedData() {
  console.log("\nSeeding initial data...")

  try {
    // Check if services already exist
    const checkResult = await pool.query("SELECT COUNT(*) FROM services")
    if (Number.parseInt(checkResult.rows[0].count) > 0) {
      console.log("Data already exists. Skipping seed.")
      return
    }

    // Load seed data
    const seedDataPath = path.join(__dirname, "../data/services.seed.json")
    if (fs.existsSync(seedDataPath)) {
      const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"))

      // Insert services
      for (const service of seedData.services || []) {
        await pool.query(
          `INSERT INTO services (name, name_am, name_or, description, description_am, description_or, 
           category, required_documents, processing_time, eligibility, department)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            service.name,
            service.name_am || service.name,
            service.name_or || service.name,
            service.description,
            service.description_am || service.description,
            service.description_or || service.description,
            service.category,
            JSON.stringify(service.required_documents || []),
            service.processing_time || "5-10 business days",
            JSON.stringify(service.eligibility || {}),
            service.department || "General Services",
          ],
        )
      }

      console.log(`✓ Seeded ${seedData.services?.length || 0} services`)
    }

    // Create default admin user
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("Admin123!", 10)

    await pool.query(
      `INSERT INTO users (email, password, role, full_name, phone) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ["admin@ethiopiannavigator.gov.et", hashedPassword, "admin", "System Administrator", "+251911000000"],
    )

    console.log("✓ Created default admin user (admin@ethiopiannavigator.gov.et / Admin123!)")
    console.log("\nDatabase setup completed successfully!")
  } catch (error) {
    console.error("Seeding failed:", error)
    throw error
  }
}

async function testConnection() {
  console.log("Testing database connection...")
  try {
    const result = await pool.query("SELECT NOW()")
    console.log("✓ Database connection successful:", result.rows[0].now)
    return true
  } catch (error) {
    console.error("✗ Database connection failed:", error.message)
    return false
  }
}

async function main() {
  console.log("=== Ethiopian Navigator Database Setup ===\n")

  // Test connection first
  const connected = await testConnection()
  if (!connected) {
    console.error("\nPlease ensure PostgreSQL is running and connection details are correct.")
    process.exit(1)
  }

  // Run migrations
  await runMigrations()

  // Seed data
  await seedData()

  // Close pool
  await pool.end()

  console.log("\n=== Setup Complete ===")
  console.log("You can now start the backend server with: npm run dev")
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Setup failed:", error)
    process.exit(1)
  })
}

module.exports = { runMigrations, seedData, testConnection }
