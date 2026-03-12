import { sql } from "@/lib/db"

interface NotificationJob {
  id: string
  notification_id: string
  status: 'pending' | 'processing' | 'sent' | 'failed'
  attempts: number
  max_attempts: number
  next_retry: Date
  error_message?: string
}

/**
 * Process notification queue - runs as a background job
 * Sends pending notifications via email, SMS, or push
 */
export async function processNotificationQueue() {
  console.log("[v0] Starting notification queue processor")

  try {
    // Get pending notifications
    const pendingJobs = await sql.unsafe(`
      SELECT nq.id, nq.notification_id, nq.status, nq.attempts, nq.max_attempts, nq.next_retry,
             n.user_id, n.type, n.title, n.message, u.email, u.phone
      FROM notification_queue nq
      JOIN notifications n ON nq.notification_id = n.id
      JOIN users u ON n.user_id = u.id
      WHERE nq.status = 'pending' AND nq.next_retry <= NOW()
      LIMIT 50
    `)

    console.log(`[v0] Found ${pendingJobs.length} pending notifications`)

    for (const job of pendingJobs) {
      await processNotificationJob(job)
    }

    // Clean up old processed notifications (older than 30 days)
    await sql.unsafe(`
      DELETE FROM notification_queue
      WHERE status IN ('sent', 'failed')
      AND updated_at < NOW() - INTERVAL '30 days'
    `)

    console.log("[v0] Notification queue processor completed")
  } catch (error) {
    console.error("[v0] Notification queue processor error:", error)
  }
}

async function processNotificationJob(job: any) {
  try {
    // Update to processing
    await sql.unsafe(`
      UPDATE notification_queue
      SET status = 'processing', attempts = attempts + 1
      WHERE id = '${job.id}'
    `)

    let success = false
    let errorMessage = ""

    // Get user preferences
    const prefs = await sql.unsafe(`
      SELECT * FROM notification_preferences WHERE user_id = '${job.user_id}'
    `)

    const preferences = prefs.length > 0 ? prefs[0] : null

    // Check quiet hours
    const isQuietHours = checkQuietHours(preferences)

    // Send via appropriate channel based on notification type and preferences
    if (job.type === "email" && preferences?.email_enabled && !isQuietHours) {
      success = await sendEmailNotification(job)
    } else if (job.type === "sms" && preferences?.sms_enabled && !isQuietHours) {
      success = await sendSmsNotification(job)
    } else if (job.type === "push" && preferences?.push_enabled) {
      success = await sendPushNotification(job)
    } else if (job.type === "in_app") {
      success = true // In-app notifications don't fail
    }

    if (success) {
      // Mark as sent
      await sql.unsafe(`
        UPDATE notification_queue
        SET status = 'sent', completed_at = NOW()
        WHERE id = '${job.id}'
      `)
      console.log(`[v0] Notification sent: ${job.id}`)
    } else {
      throw new Error("Failed to send notification")
    }
  } catch (error: any) {
    console.error(`[v0] Error processing notification ${job.id}:`, error)

    const nextRetryTime = calculateNextRetry(job.attempts)
    const isFailed = job.attempts >= job.max_attempts

    await sql.unsafe(`
      UPDATE notification_queue
      SET status = ${isFailed ? "'failed'" : "'pending'"},
          next_retry = ${isFailed ? "NOW()" : `'${nextRetryTime}'`},
          error_message = '${error.message}'
      WHERE id = '${job.id}'
    `)
  }
}

function checkQuietHours(preferences: any): boolean {
  if (!preferences?.quiet_hours_start || !preferences?.quiet_hours_end) {
    return false
  }

  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const [startHour, startMin] = preferences.quiet_hours_start.split(":").map(Number)
  const [endHour, endMin] = preferences.quiet_hours_end.split(":").map(Number)

  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime
  } else {
    return currentTime >= startTime || currentTime < endTime
  }
}

function calculateNextRetry(attempts: number): string {
  // Exponential backoff: 5min, 15min, 1hr, 4hr, 24hr
  const delays = [5, 15, 60, 240, 1440]
  const delayMinutes = delays[Math.min(attempts, delays.length - 1)]
  const nextRetry = new Date(Date.now() + delayMinutes * 60000)
  return nextRetry.toISOString()
}

async function sendEmailNotification(job: any): Promise<boolean> {
  try {
    // In production, use SendGrid, AWS SES, or similar
    // For now, log to console
    console.log(`[v0] Sending email to ${job.email}:`)
    console.log(`     Subject: ${job.title}`)
    console.log(`     Message: ${job.message}`)

    // TODO: Integrate with email service
    // const result = await sendgrid.send({
    //   to: job.email,
    //   from: 'noreply@ethiopiannavigator.gov.et',
    //   subject: job.title,
    //   html: job.message,
    // })

    return true
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return false
  }
}

async function sendSmsNotification(job: any): Promise<boolean> {
  try {
    // In production, use Twilio, AWS SNS, or similar
    console.log(`[v0] Sending SMS to ${job.phone}:`)
    console.log(`     ${job.title}: ${job.message}`)

    // TODO: Integrate with SMS service
    // const result = await twilio.messages.create({
    //   body: `${job.title}: ${job.message}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: job.phone,
    // })

    return true
  } catch (error) {
    console.error("[v0] SMS send error:", error)
    return false
  }
}

async function sendPushNotification(job: any): Promise<boolean> {
  try {
    // In production, use Firebase Cloud Messaging or similar
    console.log(`[v0] Sending push notification to user ${job.user_id}:`)
    console.log(`     Title: ${job.title}`)
    console.log(`     Message: ${job.message}`)

    // TODO: Integrate with push service
    // const result = await firebase.messaging().send({
    //   notification: {
    //     title: job.title,
    //     body: job.message,
    //   },
    //   webpush: {
    //     fcmOptions: { link: '/notifications' },
    //   },
    // })

    return true
  } catch (error) {
    console.error("[v0] Push notification send error:", error)
    return false
  }
}

// Export for use in API routes or scheduled tasks
export { processNotificationQueue as default }
