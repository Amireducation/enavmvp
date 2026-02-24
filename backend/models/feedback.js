const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

async function createFeedback(data) {
  const feedbackId = uuidv4()
  const sql = `
    INSERT INTO feedback (feedback_id, user_id, service_id, application_id, rating, comments, category, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, now())
    RETURNING *
  `
  const values = [
    feedbackId,
    data.user_id,
    data.service_id || null,
    data.application_id || null,
    data.rating,
    data.comments,
    data.category || "general",
  ]
  const res = await pool.query(sql, values)
  return res.rows[0]
}

async function listFeedback(filters = {}) {
  let sql = "SELECT * FROM feedback WHERE 1=1"
  const values = []

  if (filters.serviceId) {
    sql += ` AND service_id = $${values.length + 1}`
    values.push(filters.serviceId)
  }
  if (filters.startDate) {
    sql += ` AND created_at >= $${values.length + 1}`
    values.push(filters.startDate)
  }

  sql += " ORDER BY created_at DESC"
  const res = await pool.query(sql, values)
  return res.rows
}

module.exports = {
  createFeedback,
  listFeedback,
}
