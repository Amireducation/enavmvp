import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // In a real app, validate and decode the JWT token
    // For now, return a mock expiry time (24 hours from now)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000

    return NextResponse.json({ expiresAt })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}
