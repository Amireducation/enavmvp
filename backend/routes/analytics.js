const express = require("express")
const router = express.Router()
const pool = require("../config/db")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

// Get overview analytics (admin only)
router.get("/overview", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const usersCountQuery = "SELECT COUNT(*) as total FROM users"
    const servicesCountQuery = "SELECT COUNT(*) as total FROM services WHERE is_archived = false"
    const applicationsCountQuery = "SELECT COUNT(*) as total FROM applications"
    const feedbackCountQuery = "SELECT COUNT(*) as total FROM feedback"

    const [usersResult, servicesResult, applicationsResult, feedbackResult] = await Promise.all([
      pool.query(usersCountQuery),
      pool.query(servicesCountQuery),
      pool.query(applicationsCountQuery),
      pool.query(feedbackCountQuery),
    ])

    res.json({
      overview: {
        totalUsers: Number.parseInt(usersResult.rows[0].total),
        totalServices: Number.parseInt(servicesResult.rows[0].total),
        totalApplications: Number.parseInt(applicationsResult.rows[0].total),
        totalFeedback: Number.parseInt(feedbackResult.rows[0].total),
      },
    })
  } catch (err) {
    next(err)
  }
})

// Get application statistics
router.get("/applications", authenticateJWT, authorizeRoles("admin", "employee"), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let sql = `
      SELECT 
        status,
        COUNT(*) as count
      FROM applications
      WHERE 1=1
    `
    const values = []

    if (startDate) {
      sql += ` AND created_at >= $${values.length + 1}`
      values.push(startDate)
    }
    if (endDate) {
      sql += ` AND created_at <= $${values.length + 1}`
      values.push(endDate)
    }

    sql += " GROUP BY status ORDER BY count DESC"

    const result = await pool.query(sql, values)

    const statusDistribution = result.rows.reduce(
      (acc, row) => {
        acc[row.status] = Number.parseInt(row.count)
        return acc
      },
      { submitted: 0, processing: 0, approved: 0, rejected: 0, completed: 0 },
    )

    res.json({ statistics: statusDistribution })
  } catch (err) {
    next(err)
  }
})

// Get user growth data
router.get("/users/growth", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `

    const result = await pool.query(sql)

    res.json({
      growth: result.rows.map((row) => ({
        month: row.month,
        newUsers: Number.parseInt(row.new_users),
      })),
    })
  } catch (err) {
    next(err)
  }
})

// Get service popularity
router.get("/services/popular", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        s.service_id,
        s.name,
        s.category,
        COUNT(a.application_id) as application_count
      FROM services s
      LEFT JOIN applications a ON s.service_id = a.service_id
      WHERE s.is_archived = false
      GROUP BY s.service_id, s.name, s.category
      ORDER BY application_count DESC
      LIMIT 10
    `

    const result = await pool.query(sql)

    res.json({
      popular: result.rows.map((row) => ({
        serviceId: row.service_id,
        name: row.name,
        category: row.category,
        applicationCount: Number.parseInt(row.application_count),
      })),
    })
  } catch (err) {
    next(err)
  }
})

// Get feedback analytics
router.get("/feedback/summary", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        AVG(rating) as avg_rating,
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_feedback
      FROM feedback
    `

    const result = await pool.query(sql)
    const row = result.rows[0]

    res.json({
      summary: {
        averageRating: Number.parseFloat(row.avg_rating || 0).toFixed(2),
        totalFeedback: Number.parseInt(row.total_feedback),
        positiveFeedback: Number.parseInt(row.positive_feedback),
        negativeFeedback: Number.parseInt(row.negative_feedback),
      },
    })
  } catch (err) {
    next(err)
  }
})

// Get monthly trends
router.get("/trends/monthly", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as applications
      FROM applications
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `

    const result = await pool.query(sql)

    res.json({
      trends: result.rows.map((row) => ({
        month: row.month,
        applications: Number.parseInt(row.applications),
      })),
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
