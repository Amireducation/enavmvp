const express = require("express")
const router = express.Router()
const notificationService = require("../services/notification-service")
const { authenticateJWT } = require("../middleware/jwt-auth")
const { authorize } = require("../middleware/rbac")

// Get user notifications
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const offset = parseInt(req.query.offset) || 0
    const unreadOnly = req.query.unreadOnly === 'true'

    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      { limit, offset, unreadOnly }
    )

    const counts = await notificationService.getNotificationCounts(req.user.id)

    res.json({
      notifications,
      counts,
      pagination: { limit, offset }
    })
  } catch (error) {
    next(error)
  }
})

// Get notification counts
router.get("/counts", authenticateJWT, async (req, res, next) => {
  try {
    const counts = await notificationService.getNotificationCounts(req.user.id)
    res.json(counts)
  } catch (error) {
    next(error)
  }
})

// Mark notification as read
router.patch("/:id/read", authenticateJWT, async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }
    res.json({ notification })
  } catch (error) {
    next(error)
  }
})

// Mark all notifications as read
router.patch("/mark-all/read", authenticateJWT, async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id)
    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    next(error)
  }
})

// Delete notification
router.delete("/:id", authenticateJWT, async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id)
    res.json({ message: "Notification deleted" })
  } catch (error) {
    next(error)
  }
})

// Get user notification preferences
router.get("/preferences", authenticateJWT, async (req, res, next) => {
  try {
    const preferences = await notificationService.getUserPreferences(req.user.id)
    res.json({ preferences })
  } catch (error) {
    next(error)
  }
})

// Update notification preferences
router.put("/preferences", authenticateJWT, async (req, res, next) => {
  try {
    const preferences = await notificationService.updatePreferences(
      req.user.id,
      req.body
    )
    res.json({ preferences })
  } catch (error) {
    next(error)
  }
})

// Search notifications
router.get("/search", authenticateJWT, async (req, res, next) => {
  try {
    const { q, limit, offset } = req.query
    if (!q) {
      return res.status(400).json({ error: "Search term required" })
    }

    const results = await notificationService.searchNotifications(
      req.user.id,
      q,
      { limit: parseInt(limit) || 20, offset: parseInt(offset) || 0 }
    )

    res.json({ results })
  } catch (error) {
    next(error)
  }
})

// Get notification analytics
router.get("/analytics", authenticateJWT, async (req, res, next) => {
  try {
    const dateRange = req.query.range || '30'
    const analytics = await notificationService.getNotificationAnalytics(
      req.user.id,
      dateRange
    )
    res.json(analytics)
  } catch (error) {
    next(error)
  }
})

// Get notification history (admin)
router.get("/:id/history", authenticateJWT, authorize(['admin']), async (req, res, next) => {
  try {
    const history = await notificationService.getNotificationHistory(req.params.id)
    res.json({ history })
  } catch (error) {
    next(error)
  }
})

// Admin: Get pending emails for batch sending
router.get("/admin/pending-emails", authenticateJWT, authorize(['admin']), async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500)
    const emails = await notificationService.getPendingEmails(limit)
    res.json({ emails, count: emails.rows.length })
  } catch (error) {
    next(error)
  }
})

// Admin: Update email delivery status
router.patch("/admin/emails/:id/status", authenticateJWT, authorize(['admin']), async (req, res, next) => {
  try {
    const { status, error } = req.body
    const email = await notificationService.updateEmailStatus(
      req.params.id,
      status,
      error
    )
    res.json({ email })
  } catch (error) {
    next(error)
  }
})

// Admin: Get notification statistics
router.get("/admin/statistics", authenticateJWT, authorize(['admin']), async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_count,
        COUNT(DISTINCT user_id) as total_users,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
       FROM notifications`
    )
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

module.exports = router
