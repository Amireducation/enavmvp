import { NextRequest, NextResponse } from 'next/server'
import { processNotificationQueue } from '@/lib/notification-queue-processor'

/**
 * Cron endpoint to process notification queue
 * Should be called every 5 minutes by a scheduler like Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[v0] Notification queue processor cron triggered')
    
    await processNotificationQueue()

    return NextResponse.json({
      success: true,
      message: 'Notification queue processed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Cron error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process queue',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger for processing notifications (for testing)
 */
export async function POST(request: NextRequest) {
  try {
    // In production, verify auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[v0] Manual notification queue processing triggered')
    
    await processNotificationQueue()

    return NextResponse.json({
      success: true,
      message: 'Notification queue processed manually',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Manual processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process queue',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
