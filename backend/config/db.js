const { Pool } = require("pg")
const { getSecret } = require("./secrets")

let pool = null

async function getPool() {
  if (pool) {
    return pool
  }

  try {
    const connString = getSecret("postgresConnString")

    pool = new Pool({
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
    })

    pool.on("error", (err) => {
      console.error("[Database] Unexpected error on idle client", err)
      pool = null
    })

    console.log("[Database] Connected successfully")
  } catch (error) {
    console.error("[Database] Connection failed:", error.message)
    // Fallback to environment variable
    pool = new Pool({
      connectionString: process.env.POSTGRES_CONN_STRING,
      ssl: { rejectUnauthorized: false },
    })
  }

  return pool
}

module.exports = {
  getPool,
  query: async (text, params) => {
    const client = await getPool()
    return client.query(text, params)
  },
}
