import { put, del } from "@vercel/blob"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse } from "@/lib/api-utils"

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * POST /api/upload
 * Upload a document file
 * Body: FormData with 'file' and 'application_id' and optional 'document_type'
 */
export async function POST(request: Request) {
  try {
    const user = requireAuth(request)
    const formData = await request.formData()
    
    const file = formData.get("file") as File
    const applicationId = formData.get("application_id") as string
    const documentType = (formData.get("document_type") as string) || "general"

    // Validation
    if (!file) {
      return errorResponse("NO_FILE", "No file provided", 400)
    }

    if (!applicationId) {
      return errorResponse("NO_APPLICATION_ID", "Application ID is required", 400)
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse("INVALID_FILE_TYPE", "File type not allowed. Allowed types: PDF, images, Word docs", 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("FILE_TOO_LARGE", "File size exceeds 10MB limit", 400)
    }

    // Verify application exists and user can access it
    const app = await sql`
      SELECT id, user_id FROM service_requests WHERE id = ${applicationId}
    `

    if (app.length === 0) {
      return errorResponse("APPLICATION_NOT_FOUND", "Application not found", 404)
    }

    // Check authorization
    if (app[0].user_id !== user.id) {
      return errorResponse("UNAUTHORIZED", "Not authorized to upload to this application", 403)
    }

    // Upload to Vercel Blob
    const filename = `${applicationId}/${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "private",
      addRandomSuffix: false,
    })

    // Save metadata to database
    const document = await sql`
      INSERT INTO service_request_documents (
        service_request_id, filename, blob_url, file_type, file_size, document_type, uploaded_by
      )
      VALUES (${applicationId}, ${file.name}, ${blob.url}, ${file.type}, ${file.size}, ${documentType}, ${user.id})
      RETURNING id, filename, blob_url, file_size, file_type, created_at
    `

    return successResponse({
      document: document[0],
      message: "File uploaded successfully"
    })
  } catch (error) {
    console.error("Upload error:", error)
    return errorResponse("UPLOAD_ERROR", "Failed to upload file", 500)
  }
}
