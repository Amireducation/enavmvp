const express = require("express")
const router = express.Router()
const { authenticateJWT } = require("../middleware/auth")
const userProfileModel = require("../models/userProfile")
const { getPool } = require("../config/db")

router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const profile = await userProfileModel.getProfile(req.user.id)
    res.json({ profile, user: req.user })
  } catch (err) {
    next(err)
  }
})

router.put("/", authenticateJWT, async (req, res, next) => {
  try {
    const profile = await userProfileModel.createOrUpdateProfile(req.user.id, req.body)
    res.json({ profile })
  } catch (err) {
    next(err)
  }
})

router.patch("/notifications", authenticateJWT, async (req, res, next) => {
  try {
    const { preferences } = req.body

    const pool = await getPool()
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, notification_preferences)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET
         notification_preferences = $2,
         updated_at = now()
       RETURNING notification_preferences`,
      [req.user.id, JSON.stringify(preferences)],
    )

    res.json({ preferences: result.rows[0].notification_preferences })
  } catch (err) {
    next(err)
  }
})

router.post("/picture", authenticateJWT, async (req, res, next) => {
  try {
    const { pictureUrl } = req.body

    if (!pictureUrl) {
      return res.status(400).json({ error: "Picture URL is required" })
    }

    const pool = await getPool()
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, profile_picture_url)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET
         profile_picture_url = $2,
         updated_at = now()
       RETURNING profile_picture_url`,
      [req.user.id, pictureUrl],
    )

    res.json({ pictureUrl: result.rows[0].profile_picture_url })
  } catch (err) {
    next(err)
  }
})

router.delete("/picture", authenticateJWT, async (req, res, next) => {
  try {
    const pool = await getPool()
    await pool.query("UPDATE user_profiles SET profile_picture_url = NULL, updated_at = now() WHERE user_id = $1", [
      req.user.id,
    ])

    res.json({ message: "Profile picture removed" })
  } catch (err) {
    next(err)
  }
})

module.exports = router
