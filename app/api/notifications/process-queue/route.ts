import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Email template for application status updates
export const emailTemplates = {
  applicationApproved: (userName: string, serviceName: string) => ({
    subject: `Your ${serviceName} Application Has Been Approved`,
    html: `
      <h2>Application Approved</h2>
      <p>Dear ${userName},</p>
      <p>We are pleased to inform you that your application for <strong>${serviceName}</strong> has been approved.</p>
      <p>Please log in to your account to view details and next steps.</p>
      <p>Best regards,<br>Ethiopian Navigator Team</p>
    `,
  }),
  applicationRejected: (userName: string, serviceName: string, reason: string) => ({
    subject: `Your ${serviceName} Application Status Update`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for submitting your application for <strong>${serviceName}</strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You may reapply or contact support for assistance.</p>
      <p>Best regards,<br>Ethiopian Navigator Team</p>
    `,
  }),
  applicationPending: (userName: string, serviceName: string, trackingNumber: string) => ({
    subject: `Your ${serviceName} Application - Under Review`,
    html: `
      <h2>Application Under Review</h2>
      <p>Dear ${userName},</p>
      <p>Your application for <strong>${serviceName}</strong> is under review.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>We will notify you when a decision is made.</p>
      <p>Best regards,<br>Ethiopian Navigator Team</p>
    `,
  }),
  serviceReminder: (userName: string, serviceName: string) => ({
    subject: `Suggested Service: ${serviceName}`,
    html: `
      <h2>Service Recommendation</h2>
      <p>Dear ${userName},</p>
      <p>Based on your profile, you might be interested in <strong>${serviceName}</strong>.</p>
      <p>Visit our portal to learn more and apply.</p>
      <p>Best regards,<br>Ethiopian Navigator Team</p>
    `,
  }),
}

// Process notification queue
export async function POST(request: Request) {
  try {
    // Get pending notifications from queue
    const pending = await sql`
      SELECT id, user_id, notification_type, channel, subject, body, template_data, recipient_address
      FROM notification_queue
      WHERE status = 'pending'
        AND retry_count < 3
      LIMIT 10
    `

    if (pending.length === 0) {
      return NextResponse.json({ processed: 0, message: "No pending notifications" })
    }

    let processed = 0
    let failed = 0

    for (const notif of pending) {
      try {
        // Determine channel and send accordingly
        if (notif.channel === "email") {
          // Email sending would go here (Resend/SendGrid integration)
          console.log(`[v0] Sending email to ${notif.recipient_address}:`, notif.subject)
          
          // Mock email send - replace with actual provider
          await simulateEmailSend(notif.recipient_address, notif.subject, notif.body)

          // Mark as sent
          await sql`
            UPDATE notification_queue
            SET status = 'sent', sent_at = NOW()
            WHERE id = ${notif.id}
          `
          processed++
        } else if (notif.channel === "sms") {
          console.log(`[v0] Sending SMS to ${notif.recipient_address}`)
          // SMS sending would go here (Twilio integration)
          
          await sql`
            UPDATE notification_queue
            SET status = 'sent', sent_at = NOW()
            WHERE id = ${notif.id}
          `
          processed++
        } else if (notif.channel === "push") {
          console.log(`[v0] Sending push notification to user ${notif.user_id}`)
          // Push notification logic here
          
          await sql`
            UPDATE notification_queue
            SET status = 'sent', sent_at = NOW()
            WHERE id = ${notif.id}
          `
          processed++
        }
      } catch (error) {
        console.error("[v0] Notification send error:", error)
        failed++
        
        // Retry logic
        await sql`
          UPDATE notification_queue
          SET retry_count = retry_count + 1, 
              last_retry_at = NOW(),
              error_message = ${String(error)}
          WHERE id = ${notif.id}
        `
      }
    }

    return NextResponse.json({
      processed,
      failed,
      message: `Processed ${processed} notifications, ${failed} failed`,
    })
  } catch (error) {
    console.error("[v0] Queue processing error:", error)
    return NextResponse.json({ error: "Failed to process queue" }, { status: 500 })
  }
}

// Mock email send function (replace with Resend/SendGrid in production)
async function simulateEmailSend(to: string, subject: string, body: string): Promise<void> {
  // In production, integrate with email service
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100)
  })
}
