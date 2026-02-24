const express = require("express")
const router = express.Router()
const feedbackModel = require("../models/feedback")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

// Submit feedback
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { rating, comments, service_id, application_id, category } = req.body
    if (!rating || !comments) {
      return res.status(400).json({ error: "rating and comments are required" })
    }

    const feedback = await feedbackModel.createFeedback({
      user_id: req.user.id,
      rating,
      comments,
      service_id,
      application_id,
      category,
    })

    res.status(201).json({ feedback })
  } catch (err) {
    next(err)
  }
})

// Get feedback (admin only)
router.get("/", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { service_id, startDate } = req.query
    const feedback = await feedbackModel.listFeedback({ service_id, startDate })
    res.json({ feedback })
  } catch (err) {
    next(err)
  }
})

module.exports = router
