'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { getRoleNavigation } from '@/lib/navigation-config'

export function useNavigation() {
  const router = useRouter()
  const { user } = useAuth()

  const navigate = (path: string) => {
    router.push(path)
  }

  const getNavItems = () => {
    return getRoleNavigation(user?.role)
  }

  const getDefaultDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin'
      case 'employee':
        return '/employee'
      case 'partner':
        return '/partner'
      default:
        return '/citizen'
    }
  }

  const getDashboardPath = (role: string) => {
    const dashboards: Record<string, string> = {
      admin: '/admin',
      employee: '/employee',
      partner: '/partner',
      citizen: '/citizen',
    }
    return dashboards[role] || '/citizen'
  }

  return {
    navigate,
    getNavItems,
    getDefaultDashboard,
    getDashboardPath,
    currentRole: user?.role || 'citizen',
  }
}
