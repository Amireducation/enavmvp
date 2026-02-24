export const AUTH_API_BASE = "/api"

export interface AuthResponse {
  token: string
}

export interface User {
  id: string
  email: string
  role: "citizen" | "employee" | "admin" | "partner"
}

export const auth = {
  // Store token in localStorage
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  },

  // Retrieve token from localStorage
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  },

  // Clear token on logout
  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  },

  // Get current user from session storage
  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  // Save user to localStorage
  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  },

  // Verify token is still valid
  isTokenValid: (): boolean => {
    const token = auth.getToken()
    if (!token) return false
    // Accept demo tokens for MVP
    if (token.startsWith("demo-token-")) return true
    try {
      const parts = token.split(".")
      if (parts.length !== 3) return false
      const payload = JSON.parse(atob(parts[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = auth.getToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, { ...options, headers })
}
