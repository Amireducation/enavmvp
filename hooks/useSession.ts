'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseSessionOptions {
  onSessionExpired?: () => void
  warningTime?: number // ms before expiry to warn user
  checkInterval?: number // ms between checks
}

export function useSession(options: UseSessionOptions = {}) {
  const {
    onSessionExpired,
    warningTime = 5 * 60 * 1000, // 5 minutes before expiry
    checkInterval = 60 * 1000, // Check every minute
  } = options

  const router = useRouter()
  const [isExpired, setIsExpired] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        setIsExpired(true)
        onSessionExpired?.()
        router.push('/auth/login')
        return
      }

      const { expiresAt } = await response.json()
      const now = Date.now()
      const remaining = expiresAt - now

      setTimeRemaining(remaining)

      // Show warning if time is running out
      if (remaining > 0 && remaining < warningTime) {
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }
    } catch (error) {
      console.error('Session check failed:', error)
    }
  }, [warningTime, onSessionExpired, router])

  const renewSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        setShowWarning(false)
        setIsExpired(false)
        checkSession()
      } else {
        setIsExpired(true)
      }
    } catch (error) {
      console.error('Session renewal failed:', error)
      setIsExpired(true)
    }
  }, [checkSession])

  useEffect(() => {
    // Check session immediately
    checkSession()

    // Set up interval to check session
    const interval = setInterval(checkSession, checkInterval)

    return () => clearInterval(interval)
  }, [checkSession, checkInterval])

  return {
    isExpired,
    showWarning,
    timeRemaining,
    renewSession,
    checkSession,
  }
}
