'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'

export function SessionExpiryWarning() {
  const { showWarning, timeRemaining, renewSession, isExpired } = useSession()
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!timeRemaining) return

    const timer = setInterval(() => {
      const mins = Math.floor(timeRemaining / 60000)
      const secs = Math.floor((timeRemaining % 60000) / 1000)
      setMinutes(mins)
      setSeconds(secs)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  if (!showWarning && !isExpired) return null

  if (isExpired) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h2 className="text-lg font-semibold">Session Expired</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Your session has expired for security reasons. Please log in again to continue.
          </p>
          <Button
            onClick={() => window.location.href = '/auth/login'}
            className="w-full bg-destructive hover:bg-destructive/90"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <div className="flex items-start gap-4">
        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900">Session Expiring Soon</h3>
          <p className="text-sm text-amber-800 mt-1">
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')} minutes
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={renewSession}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Stay Logged In
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.href = '/auth/login'}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
