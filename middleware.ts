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

export function middleware(request: NextRequest) {
  // Skip static files, images, and service worker
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/public/") ||
    request.nextUrl.pathname === "/service-worker.js" ||
    request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp|js|json)$/)
  ) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  // Check if route is public
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // For now, allow all authenticated requests
  // In production, validate token and check role against protectedRoutes
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
