import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const applicationId = url.searchParams.get("application_id")

    let query
    if (applicationId) {
      // Get documents for specific application
      query = await sql`
        SELECT id, application_id, file_name, file_type, file_size, blob_url, document_type, 
               upload_status, created_at
        FROM documents
        WHERE application_id = ${applicationId} AND user_id = ${user.id}
        ORDER BY created_at DESC
      `
    } else {
      // Get all user's documents
      query = await sql`
        SELECT id, application_id, file_name, file_type, file_size, blob_url, document_type,
               upload_status, created_at
        FROM documents
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT 100
      `
    }

    return NextResponse.json({
      documents: query.map((doc: Record<string, unknown>) => ({
        id: doc.id,
        applicationId: doc.application_id,
        fileName: doc.file_name,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        url: doc.blob_url,
        documentType: doc.document_type,
        status: doc.upload_status,
        createdAt: doc.created_at,
      })),
    })
  } catch (error) {
    console.error("List error:", error)
    return NextResponse.json({ error: "Failed to list documents" }, { status: 500 })
  }
}
