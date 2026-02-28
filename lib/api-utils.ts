import { NextResponse } from "next/server"

interface TokenPayload {
  id: string
  email: string
  role: string
  exp: number
}

// API Response envelope types
interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    timestamp?: string
  }
}

interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    timestamp?: string
    requestId?: string
  }
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  meta?: { page?: number; pageSize?: number; total?: number }
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  )
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): NextResponse<ApiSuccessResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      page,
      pageSize,
      total,
      timestamp: new Date().toISOString(),
    },
  })
}

export function getUserFromRequest(request: Request): TokenPayload | null {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) return null

    const token = authHeader.slice(7)

    // Handle demo tokens for backward compatibility
    if (token.startsWith("demo-token-")) {
      const role = token.replace("demo-token-", "")
      return {
        id: `user-${role}`,
        email: `${role}@demo.gov.et`,
        role,
        exp: Math.floor(Date.now() / 1000) + 86400,
      }
    }

    // Decode JWT-like token
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload: TokenPayload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp * 1000 < Date.now()) return null

    return payload
  } catch {
    return null
  }
}

export function requireAuth(request: Request): TokenPayload {
  const user = getUserFromRequest(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function requireRole(request: Request, roles: string[]): TokenPayload {
  const user = requireAuth(request)
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}
