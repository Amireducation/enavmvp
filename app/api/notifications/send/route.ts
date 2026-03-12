import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/db';
import { validateAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await createClient();

    try {
      // Insert notification into database
      const result = await client.query(
        `INSERT INTO notifications (user_id, type, title, message, data, created_at, read_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NULL)
         RETURNING id, created_at`,
        [userId, type, title, message, JSON.stringify(data || {})]
      );

      const notificationId = result.rows[0].id;

      // Send real-time notification based on type
      if (type === 'email') {
        await sendEmailNotification(userId, title, message);
      } else if (type === 'sms') {
        await sendSmsNotification(userId, title, message);
      } else if (type === 'push') {
        await sendPushNotification(userId, title, message);
      }

      // Queue notification for processing
      await client.query(
        `INSERT INTO notification_queue (notification_id, status, attempts, next_retry)
         VALUES ($1, 'pending', 0, NOW())`,
        [notificationId]
      );

      return NextResponse.json({
        success: true,
        notificationId,
        sentAt: result.rows[0].created_at
      });
    } finally {
      await client.release();
    }
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(userId: string, title: string, message: string) {
  try {
    // Get user email
    const client = await createClient();
    const userResult = await client.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );
    await client.release();

    if (userResult.rows.length === 0) return;

    const email = userResult.rows[0].email;

    // In production, use SendGrid, AWS SES, or similar
    console.log(`[Email] To: ${email}, Subject: ${title}, Message: ${message}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendSmsNotification(userId: string, title: string, message: string) {
  try {
    // Get user phone
    const client = await createClient();
    const userResult = await client.query(
      'SELECT phone FROM users WHERE id = $1',
      [userId]
    );
    await client.release();

    if (userResult.rows.length === 0) return;

    const phone = userResult.rows[0].phone;
    if (!phone) return;

    // In production, use Twilio or similar
    console.log(`[SMS] To: ${phone}, Message: ${message}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

async function sendPushNotification(userId: string, title: string, message: string) {
  try {
    // In production, use Firebase Cloud Messaging or similar
    console.log(`[Push] To: ${userId}, Title: ${title}, Message: ${message}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
