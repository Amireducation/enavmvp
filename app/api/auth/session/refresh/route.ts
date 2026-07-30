import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // In a real app, generate a new JWT token with extended expiry
    // For now, just return success
    const newExpiresAt = Date.now() + 24 * 60 * 60 * 1000

    return NextResponse.json({
      success: true,
      expiresAt: newExpiresAt,
      message: 'Session renewed successfully',
    })
  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    )
  }
}
