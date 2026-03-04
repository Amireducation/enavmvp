import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/employee": ["admin", "employee"],
  "/citizen": ["admin", "employee", "citizen"],
  "/partner": ["admin", "partner"],
}

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/services",
  "/api/services/categories",
  "/api/services/search",
]

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // 100 requests per minute

// Simple in-memory rate limiting (for production, use Redis)
const requestCounts = new Map<string, { count: number; timestamp: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true
  }

  record.count++
  return false
}

function getTokenPayload(token: string): { id: string; email: string; role: string; exp: number } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'))
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  // Check rate limiting for API routes
  if (pathname.startsWith("/api/") && isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
      { status: 429 }
    )
  }

  // Skip auth check for public routes
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get auth token from header or cookie
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth_token")?.value

  // Check if route requires authentication
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))

  if (protectedRoute) {
    const [, allowedRoles] = protectedRoute

    if (!token) {
      // Redirect to login for page requests
      if (!pathname.startsWith("/api/")) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      )
    }

    const payload = getTokenPayload(token)
    if (!payload) {
      if (!pathname.startsWith("/api/")) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.json(
        { success: false, error: { code: "TOKEN_INVALID", message: "Invalid or expired token" } },
        { status: 401 }
      )
    }

    // Check role access
    if (!allowedRoles.includes(payload.role)) {
      if (!pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL(`/${payload.role}`, request.url))
      }
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
        { status: 403 }
      )
    }
  }

  // Add request logging header
  const response = NextResponse.next()
  response.headers.set("x-request-id", crypto.randomUUID())
  response.headers.set("x-response-time", Date.now().toString())

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
