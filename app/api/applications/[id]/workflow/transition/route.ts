import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"
import { 
  isValidTransition, 
  getStateMetadata, 
  WorkflowAction,
  type WorkflowState 
} from "@/lib/workflow-state-machine"

/**
 * POST /api/applications/[id]/workflow/transition
 * Transition application to a new state
 * Body: { to_state, action, notes, metadata }
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const { id } = await params

    const body = await request.json()
    const { to_state, action, notes, metadata } = body

    if (!to_state || !action) {
      return errorResponse("MISSING_FIELDS", "to_state and action are required", 400)
    }

    // Get current request
    const requests = await sql`
      SELECT id, status, workflow_state, user_id FROM service_requests WHERE id = ${id}
    `

    if (requests.length === 0) {
      return errorResponse("REQUEST_NOT_FOUND", "Service request not found", 404)
    }

    const request_ = requests[0]
    const fromState = request_.workflow_state as WorkflowState
    const toState = to_state as WorkflowState

    // Validate state transition
    if (!isValidTransition(fromState, toState)) {
      return errorResponse(
        "INVALID_TRANSITION",
        `Cannot transition from ${fromState} to ${toState}`,
        400
      )
    }

    // Update request state
    await sql`
      UPDATE service_requests 
      SET workflow_state = ${toState}, status = ${mapStateToStatus(toState)}, updated_at = NOW()
      WHERE id = ${id}
    `

    // Record in history
    const history = await sql`
      INSERT INTO service_request_workflow_history (
        service_request_id, from_state, to_state, action, performed_by_id, notes, metadata
      )
      VALUES (${id}, ${fromState}, ${toState}, ${action}, ${user.id}, ${notes || null}, ${JSON.stringify(metadata || {})})
      RETURNING id, from_state, to_state, action, created_at
    `

    // Create notification for applicant
    if (["approved", "rejected", "information_requested", "issued"].includes(toState)) {
      const stateMetadata = getStateMetadata(toState)
      await sql`
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, priority)
        VALUES (
          ${request_.user_id},
          'Application Status Updated',
          ${'Your application status has changed to: ' + stateMetadata.label},
          'status_update',
          'service_request',
          ${id},
          ${toState === "rejected" ? "high" : "normal"}
        )
      `
    }

    return successResponse({
      message: `Transitioned from ${fromState} to ${toState}`,
      history: history[0]
    })
  } catch (error) {
    console.error("Workflow transition error:", error)
    return errorResponse("TRANSITION_ERROR", "Failed to update workflow state", 500)
  }
}

/**
 * GET /api/applications/[id]/workflow/history
 * Get workflow history for an application
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(request, ["admin", "employee", "citizen"])
    const { id } = await params

    // Verify access
    const serviceRequest = await sql`
      SELECT user_id FROM service_requests WHERE id = ${id}
    `

    if (serviceRequest.length === 0) {
      return errorResponse("REQUEST_NOT_FOUND", "Service request not found", 404)
    }

    if (user.role === "citizen" && serviceRequest[0].user_id !== user.id) {
      return errorResponse("UNAUTHORIZED", "Not authorized to view this history", 403)
    }

    const history = await sql`
      SELECT 
        id, from_state, to_state, action, performed_by_id, notes, metadata,
        created_at
      FROM service_request_workflow_history
      WHERE service_request_id = ${id}
      ORDER BY created_at DESC
    `

    return successResponse(history)
  } catch (error) {
    console.error("Workflow history fetch error:", error)
    return errorResponse("HISTORY_FETCH_ERROR", "Failed to fetch workflow history", 500)
  }
}

/**
 * Helper function to map workflow state to status
 */
function mapStateToStatus(state: WorkflowState): string {
  const statusMap: Record<WorkflowState, string> = {
    submitted: "pending",
    submitted_for_review: "pending",
    under_review: "pending",
    information_requested: "pending",
    pending_payment: "pending",
    processing: "processing",
    pending_approval: "pending",
    approved: "approved",
    rejected: "rejected",
    issued: "approved",
    completed: "completed",
    cancelled: "cancelled",
    on_hold: "pending"
  }
  return statusMap[state]
}
