import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, successResponse, errorResponse, paginatedResponse } from "@/lib/api-utils"

/**
 * GET /api/communications/[id]
 * Get a specific communication thread
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params

    const comm = await sql`
      SELECT * FROM service_request_communications WHERE id = ${id}
    `

    if (comm.length === 0) {
      return errorResponse("COMMUNICATION_NOT_FOUND", "Communication not found", 404)
    }

    // Check authorization
    if (comm[0].sender_id !== user.id && comm[0].recipient_id !== user.id) {
      return errorResponse("UNAUTHORIZED", "Not authorized to view this communication", 403)
    }

    // Mark as read if recipient
    if (comm[0].recipient_id === user.id) {
      await sql`UPDATE service_request_communications SET is_read = TRUE WHERE id = ${id}`
    }

    return successResponse(comm[0])
  } catch (error) {
    console.error("Communication fetch error:", error)
    return errorResponse("COMMUNICATION_FETCH_ERROR", "Failed to fetch communication", 500)
  }
}

/**
 * PUT /api/communications/[id]
 * Mark communication as read
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params

    const comm = await sql`
      SELECT recipient_id FROM service_request_communications WHERE id = ${id}
    `

    if (comm.length === 0) {
      return errorResponse("COMMUNICATION_NOT_FOUND", "Communication not found", 404)
    }

    // Only recipient can mark as read
    if (comm[0].recipient_id !== user.id) {
      return errorResponse("UNAUTHORIZED", "Only recipient can mark as read", 403)
    }

    await sql`UPDATE service_request_communications SET is_read = TRUE, updated_at = NOW() WHERE id = ${id}`

    return successResponse({ message: "Marked as read" })
  } catch (error) {
    console.error("Communication update error:", error)
    return errorResponse("COMMUNICATION_UPDATE_ERROR", "Failed to update communication", 500)
  }
}
