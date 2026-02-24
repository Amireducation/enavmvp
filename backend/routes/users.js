const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const { getPool } = require("../config/db")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

router.get("/", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool.query(
      `SELECT u.id, u.email, u.role, u.full_name, u.phone, u.created_at, u.updated_at,
              up.profile_picture_url, up.language_preference
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       ORDER BY u.created_at DESC`,
    )
    res.json({ users: result.rows })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool.query(
      `SELECT u.id, u.email, u.role, u.full_name, u.phone, u.created_at, u.updated_at,
              up.profile_picture_url, up.language_preference, up.address, up.city, up.region
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
      [req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ user: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

router.post("/", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { email, password, role, full_name, phone } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const pool = await getPool()
    const hashed = await bcrypt.hash(password, 10)

    const result = await pool.query(
      "INSERT INTO users (email, password, role, full_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, full_name, phone, created_at",
      [email, hashed, role || "citizen", full_name, phone],
    )

    res.status(201).json({ user: result.rows[0] })
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "User already exists" })
    }
    next(err)
  }
})

router.put("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { email, role, full_name, phone } = req.body
    const pool = await getPool()

    const result = await pool.query(
      `UPDATE users 
       SET email = COALESCE($1, email), 
           role = COALESCE($2, role), 
           full_name = COALESCE($3, full_name), 
           phone = COALESCE($4, phone),
           updated_at = now()
       WHERE id = $5
       RETURNING id, email, role, full_name, phone, updated_at`,
      [email, role, full_name, phone, req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

router.delete("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const pool = await getPool()

    // Prevent admin from deleting themselves
    if (req.user.id === Number.parseInt(req.params.id)) {
      return res.status(400).json({ error: "Cannot delete your own account" })
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "User deleted successfully", userId: result.rows[0].id })
  } catch (err) {
    next(err)
  }
})

router.get("/search/:query", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const pool = await getPool()
    const searchTerm = `%${req.params.query}%`

    const result = await pool.query(
      `SELECT u.id, u.email, u.role, u.full_name, u.phone, u.created_at
       FROM users u
       WHERE u.email ILIKE $1 OR u.full_name ILIKE $1
       ORDER BY u.created_at DESC
       LIMIT 50`,
      [searchTerm],
    )

    res.json({ users: result.rows })
  } catch (err) {
    next(err)
  }
})

module.exports = router
