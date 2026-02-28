import { fetchWithAuth } from "./auth"

export interface ApiError {
  error: string
  details?: string
  code?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

interface RetryConfig {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  retryableStatusCodes?: number[]
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
}

/**
 * Exponential backoff with jitter
 */
function getDelayMs(attempt: number, config: RetryConfig): number {
  const { initialDelayMs = 1000, maxDelayMs = 10000, backoffMultiplier = 2 } = config
  const delay = Math.min(initialDelayMs * Math.pow(backoffMultiplier, attempt), maxDelayMs)
  const jitter = delay * 0.1 * Math.random()
  return delay + jitter
}

class ApiClient {
  private baseUrl: string
  private retryConfig: RetryConfig

  constructor(baseUrl: string, retryConfig: RetryConfig = {}) {
    this.baseUrl = baseUrl
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, attempt: number = 0): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetchWithAuth(url, options)

      if (!response.ok) {
        const isRetryable =
          attempt < (this.retryConfig.maxRetries || 3) &&
          (this.retryConfig.retryableStatusCodes || []).includes(response.status)

        if (isRetryable) {
          const delay = getDelayMs(attempt, this.retryConfig)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return this.request<T>(endpoint, options, attempt + 1)
        }

        let errorData: ApiError
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}` }
        }

        const error = new Error(errorData.error || "API request failed") as any
        error.status = response.status
        error.code = errorData.code
        throw error
      }

      const data = await response.json()
      return data.data || data
    } catch (error: any) {
      if (attempt < (this.retryConfig.maxRetries || 3) && error.status && (this.retryConfig.retryableStatusCodes || []).includes(error.status)) {
        const delay = getDelayMs(attempt, this.retryConfig)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.request<T>(endpoint, options, attempt + 1)
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient("/api")
