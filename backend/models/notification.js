const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

async function createNotification(data) {
  const notificationId = uuidv4()
  const sql = `
    INSERT INTO notifications (notification_id, user_id, type, title, message, related_entity_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, now())
    RETURNING *
  `
  const values = [notificationId, data.user_id, data.type, data.title, data.message, data.related_entity_id || null]
  const res = await pool.query(sql, values)
  return res.rows[0]
}

async function listNotifications(userId) {
  const sql = "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC"
  const res = await pool.query(sql, [userId])
  return res.rows
}

async function markAsRead(notificationId) {
  const sql = "UPDATE notifications SET is_read = true WHERE notification_id = $1 RETURNING *"
  const res = await pool.query(sql, [notificationId])
  return res.rows[0]
}

module.exports = {
  createNotification,
  listNotifications,
  markAsRead,
}
