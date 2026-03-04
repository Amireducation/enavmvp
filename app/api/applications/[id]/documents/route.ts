import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

/**
 * GET /api/applications/[id]/documents
 * Get all documents for an application
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100)
    const offset = (page - 1) * limit

    // Verify application exists and user can access it
    const app = await sql`
      SELECT user_id, status FROM service_requests WHERE id = ${id}
    `

    if (app.length === 0) {
      return errorResponse("APPLICATION_NOT_FOUND", "Application not found", 404)
    }

    // Check authorization
    if (app[0].user_id !== user.id && user.role !== "admin") {
      return errorResponse("UNAUTHORIZED", "Not authorized to access this application", 403)
    }

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM service_request_documents WHERE service_request_id = ${id}
    `
    const total = parseInt(countResult[0].total)

    // Get documents
    const documents = await sql`
      SELECT 
        id, filename, blob_url, file_type, file_size, document_type, 
        uploaded_by, created_at, updated_at
      FROM service_request_documents
      WHERE service_request_id = ${id}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return paginatedResponse(documents, page, limit, total)
  } catch (error) {
    console.error("Application documents fetch error:", error)
    return errorResponse("DOCUMENTS_FETCH_ERROR", "Failed to fetch documents", 500)
  }
}
