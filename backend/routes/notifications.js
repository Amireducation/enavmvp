const express = require("express")
const router = express.Router()
const notificationModel = require("../models/notification")
const { authenticateJWT } = require("../middleware/auth")

// Get user notifications
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const notifications = await notificationModel.listNotifications(req.user.id)
    res.json({ notifications })
  } catch (err) {
    next(err)
  }
})

// Mark notification as read
router.patch("/:id/read", authenticateJWT, async (req, res, next) => {
  try {
    const notification = await notificationModel.markAsRead(req.params.id)
    res.json({ notification })
  } catch (err) {
    next(err)
  }
})

module.exports = router
