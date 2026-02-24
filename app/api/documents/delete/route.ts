import { del } from "@vercel/blob"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function DELETE(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Verify document belongs to user
    const docs = await sql`
      SELECT id FROM documents WHERE blob_url = ${url} AND user_id = ${user.id}
    `
    if (docs.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(url)

    // Delete from database
    await sql`
      DELETE FROM documents WHERE blob_url = ${url}
    `

    // Log audit trail
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id)
      VALUES (${user.id}, 'document_delete', 'document', ${url})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
