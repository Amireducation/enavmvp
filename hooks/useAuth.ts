'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

interface User {
  id: string
  email: string
  name: string
  role: string
  verified: boolean
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await apiClient.get<{ user: User }>('/auth/me')
        if (response.user) {
          setUser(response.user)
        }
      } catch (err) {
        setError('Failed to authenticate')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {})
      setUser(null)
      router.push('/')
    } catch (err) {
      setError('Failed to logout')
    }
  }

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  }
}
