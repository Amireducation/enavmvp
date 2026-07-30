'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

interface AutoRefreshContextType {
  isRefreshing: boolean
  lastRefresh: Date | null
  triggerRefresh: () => void
  setAutoRefreshInterval: (ms: number) => void
  unsubscribe: (callback: () => void) => void
  subscribe: (callback: () => void) => () => void
}

const AutoRefreshContext = createContext<AutoRefreshContextType | undefined>(undefined)

export function AutoRefreshProvider({ children }: { children: ReactNode }) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds default
  const [subscribers, setSubscribers] = useState<Set<() => void>>(new Set())

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true)
    setLastRefresh(new Date())

    // Call all subscribers
    subscribers.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Refresh callback error:', error)
      }
    })

    // Simulate refresh completion
    setTimeout(() => setIsRefreshing(false), 500)
  }, [subscribers])

  const subscribe = useCallback((callback: () => void) => {
    setSubscribers(prev => new Set(prev).add(callback))
    // Return unsubscribe function
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev)
        newSet.delete(callback)
        return newSet
      })
    }
  }, [])

  const unsubscribe = useCallback((callback: () => void) => {
    setSubscribers(prev => {
      const newSet = new Set(prev)
      newSet.delete(callback)
      return newSet
    })
  }, [])

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      triggerRefresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, triggerRefresh])

  return (
    <AutoRefreshContext.Provider
      value={{
        isRefreshing,
        lastRefresh,
        triggerRefresh,
        setAutoRefreshInterval,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </AutoRefreshContext.Provider>
  )
}

export function useAutoRefresh() {
  const context = useContext(AutoRefreshContext)
  if (!context) {
    throw new Error('useAutoRefresh must be used within AutoRefreshProvider')
  }
  return context
}
