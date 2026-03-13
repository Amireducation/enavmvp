import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/employee": ["admin", "employee"],
  "/citizen": ["admin", "employee", "citizen"],
  "/partner": ["admin", "partner"],
  "/g2g": ["admin", "employee"],
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
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]

// Role-based default dashboards
const roleDashboards: Record<string, string> = {
  admin: "/admin",
  employee: "/employee",
  citizen: "/citizen",
  partner: "/partner",
}

export function middleware(request: NextRequest) {
  // Skip static files and images
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/public/") ||
    request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/)
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

  // Get token and user role from cookies
  const token = request.cookies.get("auth_token")?.value
  const userRole = request.cookies.get("userRole")?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If authenticated but trying to access auth pages, redirect to dashboard
  if (pathname.startsWith("/auth/")) {
    const dashboard = roleDashboards[userRole || "citizen"]
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  // Check role-based route protection
  if (userRole) {
    // Find which protected route this path belongs to
    let requiredRole: string[] = []
    for (const [route, roles] of Object.entries(protectedRoutes)) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        requiredRole = roles
        break
      }
    }

    // If route requires specific role and user doesn't have it, redirect to dashboard
    if (requiredRole.length > 0 && !requiredRole.includes(userRole)) {
      const dashboard = roleDashboards[userRole]
      return NextResponse.redirect(new URL(dashboard || "/citizen", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
