const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { getPool } = require("../config/db")
const { getSecret } = require("../config/secrets")
const { authenticateJWT } = require("../middleware/auth")

function badRequest(res, message) {
  return res.status(400).json({ error: message })
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password) return badRequest(res, "email and password required")

    const hashed = await bcrypt.hash(password, 10)
    const pool = await getPool()

    await pool.query("INSERT INTO users (email, password, role) VALUES ($1, $2, $3)", [email, hashed, role || "user"])
    res.status(201).json({ message: "User registered" })
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "User already exists" })
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return badRequest(res, "email and password required")

    const pool = await getPool()
    const result = await pool.query("SELECT id, email, password, role FROM users WHERE email = $1", [email])
    const user = result.rows[0]

    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: "Invalid credentials" })

    const payload = { id: user.id, email: user.email, role: user.role }

    const jwtSecret = getSecret("jwtSecret")
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "7d" })

    res.json({ token })
  } catch (err) {
    next(err)
  }
})

router.post("/change-password", authenticateJWT, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return badRequest(res, "Current password and new password are required")
    }

    if (newPassword.length < 6) {
      return badRequest(res, "New password must be at least 6 characters")
    }

    const pool = await getPool()
    const result = await pool.query("SELECT password FROM users WHERE id = $1", [req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(currentPassword, user.password)

    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    const hashedNew = await bcrypt.hash(newPassword, 10)
    await pool.query("UPDATE users SET password = $1, updated_at = now() WHERE id = $2", [hashedNew, req.user.id])

    res.json({ message: "Password changed successfully" })
  } catch (err) {
    next(err)
  }
})

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return badRequest(res, "Email is required")
    }

    const pool = await getPool()
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) {
      // Don't reveal if user exists
      return res.json({ message: "If the email exists, a reset link has been sent" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpiry = new Date(Date.now() + 3600000) // 1 hour

    await pool.query("UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3", [
      resetToken,
      resetExpiry,
      result.rows[0].id,
    ])

    // TODO: Send email with reset link
    // For now, return token (in production, this should be sent via email)
    console.log(`[Password Reset] Token for ${email}: ${resetToken}`)

    res.json({
      message: "If the email exists, a reset link has been sent",
      // Remove this in production
      resetToken: resetToken,
    })
  } catch (err) {
    next(err)
  }
})

router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return badRequest(res, "Token and new password are required")
    }

    if (newPassword.length < 6) {
      return badRequest(res, "Password must be at least 6 characters")
    }

    const pool = await getPool()
    const result = await pool.query("SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > now()", [
      token,
    ])

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = now() WHERE id = $2",
      [hashedPassword, result.rows[0].id],
    )

    res.json({ message: "Password reset successfully" })
  } catch (err) {
    next(err)
  }
})

module.exports = router
