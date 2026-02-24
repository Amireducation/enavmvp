const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const pool = require("../config/db")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

// Get all partnerships (admin/partner only)
router.get("/", authenticateJWT, authorizeRoles("admin", "partner"), async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM partnerships 
      ORDER BY created_at DESC
    `
    const result = await pool.query(sql)
    res.json({ partnerships: result.rows })
  } catch (err) {
    next(err)
  }
})

// Get partnership by ID
router.get("/:id", authenticateJWT, authorizeRoles("admin", "partner"), async (req, res, next) => {
  try {
    const sql = "SELECT * FROM partnerships WHERE partnership_id = $1"
    const result = await pool.query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partnership not found" })
    }

    res.json({ partnership: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

// Create new partnership (admin only)
router.post("/", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { organization_name, contact_person, contact_email, partnership_type, description } = req.body

    if (!organization_name || !contact_email) {
      return res.status(400).json({ error: "Organization name and contact email are required" })
    }

    const partnershipId = uuidv4()
    const sql = `
      INSERT INTO partnerships 
      (partnership_id, organization_name, contact_person, contact_email, partnership_type, description, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'active', now())
      RETURNING *
    `
    const values = [partnershipId, organization_name, contact_person, contact_email, partnership_type, description]

    const result = await pool.query(sql, values)
    res.status(201).json({ partnership: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

// Update partnership
router.patch("/:id", authenticateJWT, authorizeRoles("admin", "partner"), async (req, res, next) => {
  try {
    const { organization_name, contact_person, contact_email, partnership_type, description, status } = req.body

    const updates = []
    const values = []
    let paramIndex = 1

    if (organization_name) {
      updates.push(`organization_name = $${paramIndex++}`)
      values.push(organization_name)
    }
    if (contact_person) {
      updates.push(`contact_person = $${paramIndex++}`)
      values.push(contact_person)
    }
    if (contact_email) {
      updates.push(`contact_email = $${paramIndex++}`)
      values.push(contact_email)
    }
    if (partnership_type) {
      updates.push(`partnership_type = $${paramIndex++}`)
      values.push(partnership_type)
    }
    if (description) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (status) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }

    updates.push(`updated_at = now()`)
    values.push(req.params.id)

    const sql = `
      UPDATE partnerships 
      SET ${updates.join(", ")}
      WHERE partnership_id = $${paramIndex}
      RETURNING *
    `

    const result = await pool.query(sql, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partnership not found" })
    }

    res.json({ partnership: result.rows[0] })
  } catch (err) {
    next(err)
  }
})

// Delete partnership (admin only)
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const sql = "DELETE FROM partnerships WHERE partnership_id = $1 RETURNING *"
    const result = await pool.query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partnership not found" })
    }

    res.json({ message: "Partnership deleted successfully" })
  } catch (err) {
    next(err)
  }
})

// Get partnership programs
router.get("/:id/programs", authenticateJWT, authorizeRoles("admin", "partner"), async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM partnership_programs 
      WHERE partnership_id = $1
      ORDER BY created_at DESC
    `
    const result = await pool.query(sql, [req.params.id])
    res.json({ programs: result.rows })
  } catch (err) {
    next(err)
  }
})

module.exports = router
