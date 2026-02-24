"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { auth, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = auth.getUser()
    if (storedUser && auth.isTokenValid()) {
      setUserState(storedUser)
    } else if (!auth.isTokenValid()) {
      // Clear invalid token
      auth.clearToken()
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    auth.clearToken()
    setUserState(null)
    router.push("/")
  }

  const setUser = (newUser: User) => {
    auth.setUser(newUser)
    setUserState(newUser)
  }

  return <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
