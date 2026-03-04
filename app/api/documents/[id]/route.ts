import { del } from "@vercel/blob"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse } from "@/lib/api-utils"

/**
 * GET /api/documents/[id]
 * Get document details
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params

    const document = await sql`
      SELECT d.*, sr.user_id 
      FROM service_request_documents d
      JOIN service_requests sr ON d.service_request_id = sr.id
      WHERE d.id = ${id}
    `

    if (document.length === 0) {
      return errorResponse("DOCUMENT_NOT_FOUND", "Document not found", 404)
    }

    // Check authorization
    if (document[0].user_id !== user.id && user.role !== "admin") {
      return errorResponse("UNAUTHORIZED", "Not authorized to access this document", 403)
    }

    return successResponse(document[0])
  } catch (error) {
    console.error("Document fetch error:", error)
    return errorResponse("DOCUMENT_FETCH_ERROR", "Failed to fetch document", 500)
  }
}

/**
 * DELETE /api/documents/[id]
 * Delete a document
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params

    const document = await sql`
      SELECT d.*, sr.user_id 
      FROM service_request_documents d
      JOIN service_requests sr ON d.service_request_id = sr.id
      WHERE d.id = ${id}
    `

    if (document.length === 0) {
      return errorResponse("DOCUMENT_NOT_FOUND", "Document not found", 404)
    }

    // Check authorization
    if (document[0].user_id !== user.id && user.role !== "admin") {
      return errorResponse("UNAUTHORIZED", "Not authorized to delete this document", 403)
    }

    // Delete from Vercel Blob
    try {
      await del(document[0].blob_url)
    } catch (blobError) {
      console.error("Error deleting from blob storage:", blobError)
      // Continue anyway to clean up database
    }

    // Delete from database
    await sql`DELETE FROM service_request_documents WHERE id = ${id}`

    return successResponse({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Document delete error:", error)
    return errorResponse("DOCUMENT_DELETE_ERROR", "Failed to delete document", 500)
  }
}
