const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

async function createApplication(data) {
  const applicationId = uuidv4()
  const sql = `
    INSERT INTO applications (application_id, user_id, service_id, status, submitted_data, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, now(), now())
    RETURNING *
  `
  const values = [applicationId, data.user_id, data.service_id, "submitted", JSON.stringify(data.submitted_data || {})]
  const res = await pool.query(sql, values)
  return res.rows[0]
}

async function getApplicationById(applicationId) {
  const sql = "SELECT * FROM applications WHERE application_id = $1"
  const res = await pool.query(sql, [applicationId])
  return res.rows[0]
}

async function listApplicationsByUser(userId) {
  const sql = "SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC"
  const res = await pool.query(sql, [userId])
  return res.rows
}

async function updateApplicationStatus(applicationId, status) {
  const sql = `
    UPDATE applications 
    SET status = $1, updated_at = now() 
    WHERE application_id = $2 
    RETURNING *
  `
  const res = await pool.query(sql, [status, applicationId])
  return res.rows[0]
}

async function uploadApplicationDocument(applicationId, documentUrl) {
  const sql = `
    UPDATE applications 
    SET documents = array_append(documents, $1), updated_at = now() 
    WHERE application_id = $2 
    RETURNING *
  `
  const res = await pool.query(sql, [documentUrl, applicationId])
  return res.rows[0]
}

async function listAllApplications(filters = {}) {
  const { status, service_id, startDate, endDate, page = 1, limit = 50 } = filters

  if (process.env.POSTGRES_CONN_STRING) {
    let query = "SELECT * FROM applications WHERE 1=1"
    const params = []
    let paramIndex = 1

    if (status) {
      query += ` AND status = $${paramIndex++}`
      params.push(status)
    }

    if (service_id) {
      query += ` AND service_id = $${paramIndex++}`
      params.push(service_id)
    }

    if (startDate) {
      query += ` AND created_at >= $${paramIndex++}`
      params.push(startDate)
    }

    if (endDate) {
      query += ` AND created_at <= $${paramIndex++}`
      params.push(endDate)
    }

    // Count total for pagination
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*)")
    const countRes = await pool.query(countQuery, params)
    const total = Number.parseInt(countRes.rows[0].count)

    // Add pagination
    const offset = (page - 1) * limit
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`
    params.push(limit, offset)

    const res = await pool.query(query, params)

    return {
      applications: res.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Memory fallback - simple filtering
  return {
    applications: [],
    pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
  }
}

module.exports = {
  createApplication,
  getApplicationById,
  listApplicationsByUser,
  updateApplicationStatus,
  uploadApplicationDocument,
  listAllApplications,
}
