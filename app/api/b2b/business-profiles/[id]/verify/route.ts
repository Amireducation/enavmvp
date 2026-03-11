import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireRole(request, ["admin", "employee"])
    const { id } = await params
    const body = await request.json()
    const { action, rejectionReason } = body

    if (!action || !["approve", "reject"].includes(action)) {
      return errorResponse("INVALID_ACTION", "Action must be 'approve' or 'reject'", 400)
    }

    if (action === "reject" && !rejectionReason) {
      return errorResponse("MISSING_REASON", "Rejection reason is required", 400)
    }

    // Check if business profile exists
    const existing = await sql`
      SELECT id, verification_status, business_name, user_id
      FROM business_profiles
      WHERE id = ${id}
    `

    if (existing.length === 0) {
      return errorResponse("NOT_FOUND", "Business profile not found", 404)
    }

    const profile = existing[0]

    if (profile.verification_status === "verified" && action === "approve") {
      return errorResponse("ALREADY_VERIFIED", "Business is already verified", 400)
    }

    // Get old values for audit
    const oldValues = {
      verification_status: profile.verification_status,
    }

    // Update verification status
    const newStatus = action === "approve" ? "verified" : "rejected"
    
    await sql`
      UPDATE business_profiles
      SET 
        verification_status = ${newStatus},
        verified_at = ${action === "approve" ? new Date() : null},
        verified_by_user_id = ${action === "approve" ? user.id : null},
        rejection_reason = ${action === "reject" ? rejectionReason : null},
        updated_at = NOW()
      WHERE id = ${id}
    `

    // Log audit
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
      VALUES (
        ${user.id}, 
        ${action === "approve" ? "verify_business" : "reject_business"}, 
        'business_profile', 
        ${id},
        ${JSON.stringify(oldValues)},
        ${JSON.stringify({ verification_status: newStatus, rejection_reason: rejectionReason || null })}
      )
    `

    // Create notification for business owner
    await sql`
      INSERT INTO notifications (user_id, title, message, type, priority, reference_type, reference_id)
      VALUES (
        ${profile.user_id},
        ${action === "approve" ? 'Business Verified' : 'Business Verification Rejected'},
        ${action === "approve" 
          ? 'Congratulations! Your business "' + profile.business_name + '" has been verified.'
          : 'Your business verification for "' + profile.business_name + '" was rejected. Reason: ' + rejectionReason
        },
        ${action === "approve" ? 'success' : 'warning'},
        'high',
        'business_profile',
        ${id}
      )
    `

    return successResponse({
      id: id,
      verificationStatus: newStatus,
      message: action === "approve" 
        ? "Business profile verified successfully"
        : "Business profile rejected",
      verifiedBy: user.email,
      verifiedAt: action === "approve" ? new Date().toISOString() : null,
    })
  } catch (error: any) {
    console.error("Business verification error:", error)
    if (error.message === "Unauthorized") {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401)
    }
    if (error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Admin or employee access required", 403)
    }
    return errorResponse("VERIFICATION_ERROR", "Failed to verify business profile", 500)
  }
}
