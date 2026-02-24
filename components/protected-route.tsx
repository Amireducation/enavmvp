"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push("/")
    }
  }, [user, isLoading, router, requiredRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
