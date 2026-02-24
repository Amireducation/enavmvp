"use client"

import { Badge } from "@/components/ui/badge"

interface ApplicationStatusBadgeProps {
  status: "submitted" | "processing" | "approved" | "rejected" | "completed"
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const statusConfig = {
    submitted: { label: "Submitted", className: "bg-blue-500/20 text-blue-200" },
    processing: { label: "Processing", className: "bg-amber-500/20 text-amber-200" },
    approved: { label: "Approved", className: "bg-green-500/20 text-green-200" },
    rejected: { label: "Rejected", className: "bg-red-500/20 text-red-200" },
    completed: { label: "Completed", className: "bg-purple-500/20 text-purple-200" },
  }

  const config = statusConfig[status]
  return <Badge className={config.className}>{config.label}</Badge>
}
