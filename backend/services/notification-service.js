const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

class NotificationService {
  // Create notification with multi-channel support
  async createNotification(data) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      
      // Validate user preferences
      const prefResult = await client.query(
        'SELECT * FROM notification_preferences WHERE user_id = $1',
        [data.user_id]
      )
      const preferences = prefResult.rows[0]

      // Create main notification record
      const notificationResult = await client.query(
        `INSERT INTO notifications 
         (user_id, type_id, title, message, priority, related_entity_id, related_entity_type, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [data.user_id, data.type_id || null, data.title, data.message, data.priority || 'normal',
         data.related_entity_id || null, data.related_entity_type || null, data.created_by || null]
      )
      const notification = notificationResult.rows[0]

      // Queue for each enabled channel
      if (preferences?.email_enabled && data.email) {
        await this.queueEmail(client, notification.notification_id, data.email, data.title, data.message)
      }
      if (preferences?.push_enabled && data.device_token) {
        await this.queuePush(client, notification.notification_id, data.device_token, data.platform || 'web')
      }
      if (preferences?.sms_enabled && data.phone_number) {
        await this.queueSMS(client, notification.notification_id, data.phone_number, data.message)
      }

      await client.query('COMMIT')
      return notification
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  // Queue email notification
  async queueEmail(client, notificationId, email, subject, message) {
    const htmlContent = `<html><body><h2>${subject}</h2><p>${message}</p></body></html>`
    return await client.query(
      `INSERT INTO email_queue (notification_id, recipient_email, subject, html_content, plain_text)
       VALUES ($1, $2, $3, $4, $5)`,
      [notificationId, email, subject, htmlContent, message]
    )
  }

  // Queue push notification
  async queuePush(client, notificationId, deviceToken, platform) {
    return await client.query(
      `INSERT INTO push_notifications (notification_id, device_token, platform)
       VALUES ($1, $2, $3)`,
      [notificationId, deviceToken, platform]
    )
  }

  // Queue SMS notification
  async queueSMS(client, notificationId, phoneNumber, message) {
    const truncatedMsg = message.substring(0, 160)
    return await client.query(
      `INSERT INTO sms_queue (notification_id, phone_number, message_content)
       VALUES ($1, $2, $3)`,
      [notificationId, phoneNumber, truncatedMsg]
    )
  }

  // Get user notifications with pagination
  async getUserNotifications(userId, options = {}) {
    const limit = options.limit || 20
    const offset = options.offset || 0
    const unreadOnly = options.unreadOnly || false

    let query = `SELECT * FROM notifications WHERE user_id = $1`
    const params = [userId]

    if (unreadOnly) {
      query += ` AND is_read = false`
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    return result.rows
  }

  // Get notification count by status
  async getNotificationCounts(userId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical
       FROM notifications WHERE user_id = $1`,
      [userId]
    )
    return result.rows[0]
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE notification_id = $1 RETURNING *`,
      [notificationId]
    )
    return result.rows[0]
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND is_read = false
       RETURNING COUNT(*) as count`,
      [userId]
    )
    return result.rows[0]
  }

  // Delete notification
  async deleteNotification(notificationId) {
    return await pool.query(
      'DELETE FROM notifications WHERE notification_id = $1',
      [notificationId]
    )
  }

  // Update notification preferences
  async updatePreferences(userId, preferences) {
    const result = await pool.query(
      `UPDATE notification_preferences SET 
        email_enabled = $2, sms_enabled = $3, push_enabled = $4, in_app_enabled = $5,
        quiet_hours_start = $6, quiet_hours_end = $7, timezone = $8, language = $9,
        updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING *`,
      [userId, preferences.email_enabled, preferences.sms_enabled, preferences.push_enabled,
       preferences.in_app_enabled, preferences.quiet_hours_start, preferences.quiet_hours_end,
       preferences.timezone, preferences.language]
    )
    return result.rows[0]
  }

  // Get user preferences
  async getUserPreferences(userId) {
    const result = await pool.query(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    )
    return result.rows[0]
  }

  // Get email queue for sending
  async getPendingEmails(limit = 100) {
    return await pool.query(
      `SELECT * FROM email_queue WHERE delivery_status = 'pending' 
       AND retry_count < max_retries
       ORDER BY created_at ASC
       LIMIT $1`,
      [limit]
    )
  }

  // Update email delivery status
  async updateEmailStatus(emailId, status, errorMessage = null) {
    return await pool.query(
      `UPDATE email_queue SET 
        delivery_status = $2, sent_at = CURRENT_TIMESTAMP, error_message = $3
       WHERE email_id = $1
       RETURNING *`,
      [emailId, status, errorMessage]
    )
  }

  // Get notification history
  async getNotificationHistory(notificationId) {
    const result = await pool.query(
      `SELECT * FROM notification_history WHERE notification_id = $1
       ORDER BY created_at DESC`,
      [notificationId]
    )
    return result.rows
  }

  // Get pending push notifications
  async getPendingPushNotifications(limit = 50) {
    return await pool.query(
      `SELECT * FROM push_notifications WHERE delivery_status = 'pending'
       AND retry_count < 3
       ORDER BY created_at ASC
       LIMIT $1`,
      [limit]
    )
  }

  // Update push delivery status
  async updatePushStatus(pushId, status, response = null) {
    return await pool.query(
      `UPDATE push_notifications SET 
        delivery_status = $2, sent_at = CURRENT_TIMESTAMP, delivery_response = $3, retry_count = retry_count + 1
       WHERE push_id = $1
       RETURNING *`,
      [pushId, status, JSON.stringify(response)]
    )
  }

  // Search notifications
  async searchNotifications(userId, searchTerm, options = {}) {
    const limit = options.limit || 20
    const offset = options.offset || 0

    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 AND (title ILIKE $2 OR message ILIKE $2)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, `%${searchTerm}%`, limit, offset]
    )
    return result.rows
  }

  // Get analytics
  async getNotificationAnalytics(userId, dateRange = '30') {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = true THEN 1 END) as read_count,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as last_24h,
        AVG(CASE WHEN is_read THEN EXTRACT(EPOCH FROM (read_at - created_at))/3600 END) as avg_read_time_hours
       FROM notifications 
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${dateRange} days'`,
      [userId]
    )
    return result.rows[0]
  }
}

module.exports = new NotificationService()
