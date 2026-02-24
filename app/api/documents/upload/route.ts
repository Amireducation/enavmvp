import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const applicationId = formData.get("application_id") as string
    const documentType = formData.get("document_type") as string

    if (!file || !applicationId || !documentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 413 })
    }

    // Verify application belongs to user
    const apps = await sql`
      SELECT id FROM service_requests WHERE id = ${applicationId} AND user_id = ${user.id}
    `
    if (apps.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Upload to Vercel Blob
    const fileName = `${user.id}/${applicationId}/${Date.now()}-${file.name}`
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Save document record
    await sql`
      INSERT INTO documents (application_id, user_id, file_name, file_type, file_size, blob_url, document_type)
      VALUES (${applicationId}, ${user.id}, ${file.name}, ${file.type}, ${file.size}, ${blob.url}, ${documentType})
    `

    // Log audit trail
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
      VALUES (${user.id}, 'document_upload', 'document', ${blob.url}, ${JSON.stringify({ file_name: file.name, file_size: file.size, document_type: documentType })})
    `

    return NextResponse.json({
      success: true,
      document: {
        url: blob.url,
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
