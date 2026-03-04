/**
 * Service Request Workflow State Machine
 * Defines valid state transitions and business rules for G2B service applications
 */

export type WorkflowState = 
  | "submitted"      // Initial state - application submitted
  | "submitted_for_review"  // Moved to review queue
  | "under_review"   // Being reviewed by employee
  | "information_requested"  // Need more info from applicant
  | "pending_payment"  // Ready but payment needed
  | "processing"     // Active processing
  | "pending_approval"  // Awaiting final approval
  | "approved"       // Approved
  | "rejected"       // Rejected
  | "issued"         // Document/permit issued
  | "completed"      // Service completed
  | "cancelled"      // Cancelled by user
  | "on_hold"        // Temporarily paused

export type WorkflowAction =
  | "submit"
  | "move_to_review"
  | "assign"
  | "request_information"
  | "provide_information"
  | "process"
  | "approve"
  | "reject"
  | "issue_document"
  | "complete"
  | "cancel"
  | "hold"
  | "resume"

/**
 * State transition matrix - defines which states can transition to which states
 */
const STATE_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  submitted: ["submitted_for_review", "cancelled"],
  submitted_for_review: ["under_review", "information_requested", "rejected"],
  under_review: ["information_requested", "pending_payment", "pending_approval", "rejected", "on_hold"],
  information_requested: ["under_review", "rejected", "cancelled"],
  pending_payment: ["processing", "cancelled"],
  processing: ["pending_approval", "information_requested", "rejected", "on_hold"],
  pending_approval: ["approved", "rejected"],
  approved: ["issued", "rejected"],
  rejected: ["submitted", "cancelled"],
  issued: ["completed"],
  completed: [],
  cancelled: [],
  on_hold: ["under_review", "cancelled"]
}

/**
 * Activity history entry for tracking state changes
 */
export interface WorkflowHistoryEntry {
  id: string
  service_request_id: string
  from_state: WorkflowState
  to_state: WorkflowState
  action: WorkflowAction
  performed_by_id: string
  performed_by_role: string
  notes?: string
  metadata?: Record<string, any>
  created_at: Date
}

/**
 * Check if a state transition is valid
 */
export function isValidTransition(fromState: WorkflowState, toState: WorkflowState): boolean {
  if (fromState === toState) return false
  return STATE_TRANSITIONS[fromState]?.includes(toState) ?? false
}

/**
 * Get all valid next states from current state
 */
export function getValidNextStates(currentState: WorkflowState): WorkflowState[] {
  return STATE_TRANSITIONS[currentState] || []
}

/**
 * Get state metadata for UI display
 */
export function getStateMetadata(state: WorkflowState) {
  const metadata: Record<WorkflowState, { label: string; label_am: string; color: string; icon: string; description: string }> = {
    submitted: {
      label: "Submitted",
      label_am: "ሐውልት ተልኩልኩ",
      color: "blue",
      icon: "file-check",
      description: "Application submitted and awaiting review"
    },
    submitted_for_review: {
      label: "In Queue",
      label_am: "ውሳኔ በመጠባበቅ ላይ",
      color: "yellow",
      icon: "clock",
      description: "In review queue"
    },
    under_review: {
      label: "Under Review",
      label_am: "ወደ ማጣራት",
      color: "cyan",
      icon: "eye",
      description: "Being reviewed by government staff"
    },
    information_requested: {
      label: "Info Requested",
      label_am: "ተጨማሪ መረጃ ተጠይቋል",
      color: "orange",
      icon: "alert-circle",
      description: "Additional information needed from applicant"
    },
    pending_payment: {
      label: "Awaiting Payment",
      label_am: "ክፍያ በመጠባበቅ ላይ",
      color: "red",
      icon: "credit-card",
      description: "Payment required to proceed"
    },
    processing: {
      label: "Processing",
      label_am: "በሂደት ላይ",
      color: "purple",
      icon: "loader",
      description: "Application is being processed"
    },
    pending_approval: {
      label: "Pending Approval",
      label_am: "ውሳኔ በመጠባበቅ ላይ",
      color: "indigo",
      icon: "check-circle",
      description: "Waiting for final approval"
    },
    approved: {
      label: "Approved",
      label_am: "ተቀባይነት ያገኘ",
      color: "green",
      icon: "check",
      description: "Application approved"
    },
    rejected: {
      label: "Rejected",
      label_am: "ተክል ወጥቷል",
      color: "red",
      icon: "x-circle",
      description: "Application rejected"
    },
    issued: {
      label: "Document Issued",
      label_am: "ሰነድ ተሰጥቷል",
      color: "teal",
      icon: "file-text",
      description: "Permit or document has been issued"
    },
    completed: {
      label: "Completed",
      label_am: "ተጠናቅቋል",
      color: "emerald",
      icon: "check-double",
      description: "Service completed successfully"
    },
    cancelled: {
      label: "Cancelled",
      label_am: "ተወግዷል",
      color: "gray",
      icon: "slash",
      description: "Application cancelled"
    },
    on_hold: {
      label: "On Hold",
      label_am: "ተጠብቆ ነው",
      color: "amber",
      icon: "pause",
      description: "Application temporarily paused"
    }
  }

  return metadata[state]
}

/**
 * Estimate progress percentage based on current state
 */
export function getProgressPercentage(state: WorkflowState): number {
  const progressMap: Record<WorkflowState, number> = {
    submitted: 10,
    submitted_for_review: 20,
    under_review: 40,
    information_requested: 30,
    pending_payment: 50,
    processing: 60,
    pending_approval: 80,
    approved: 85,
    rejected: 0,
    issued: 95,
    completed: 100,
    cancelled: 0,
    on_hold: 35
  }

  return progressMap[state] || 0
}
