const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_CONN_STRING || "postgresql://postgres:postgres@localhost:5432/ethiopian_navigator",
})

async function testDatabase() {
  console.log("=== Database Connection Test ===\n")

  try {
    // Test connection
    console.log("Testing connection...")
    const timeResult = await pool.query("SELECT NOW()")
    console.log("✓ Connection successful")
    console.log("  Server time:", timeResult.rows[0].now)

    // Check tables
    console.log("\nChecking tables...")
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    if (tablesResult.rows.length === 0) {
      console.log("⚠ No tables found. Run migrations first: npm run migrate")
    } else {
      console.log("✓ Found tables:")
      tablesResult.rows.forEach((row) => {
        console.log(`  - ${row.table_name}`)
      })
    }

    // Count records
    console.log("\nRecord counts:")
    const tables = ["users", "services", "applications", "feedback", "notifications"]

    for (const table of tables) {
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`)
        console.log(`  ${table}: ${countResult.rows[0].count} records`)
      } catch (error) {
        console.log(`  ${table}: table not found`)
      }
    }

    console.log("\n✓ Database test completed successfully!")
  } catch (error) {
    console.error("\n✗ Database test failed:")
    console.error("Error:", error.message)
    console.error("\nTroubleshooting:")
    console.error("1. Ensure PostgreSQL is running")
    console.error("2. Check connection string in .env file")
    console.error("3. Verify database exists: createdb ethiopian_navigator")
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testDatabase()
