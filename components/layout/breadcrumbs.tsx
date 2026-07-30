"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

const pathLabelMap: Record<string, string> = {
  citizen: "Citizen Portal",
  employee: "Employee Portal",
  admin: "Admin Dashboard",
  partner: "Partner Portal",
  services: "Services",
  applications: "Applications",
  requests: "Requests",
  users: "Users",
  analytics: "Analytics",
  settings: "Settings",
  notifications: "Notifications",
  chat: "AI Assistant",
  chatbot: "AI Assistant",
  browse: "Browse Services",
  request: "New Request",
  feedback: "Feedback",
  health: "System Health",
  "service-expansion": "Service Expansion",
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || generateBreadcrumbs(pathname)

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)} aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {isLast || !item.href ? (
              <span className={cn(
                "font-medium",
                isLast ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    // Skip dynamic route segments (those that start with [)
    if (segment.startsWith("[")) return

    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = pathLabelMap[segment] || formatSegment(segment)
    
    breadcrumbs.push({ label, href })
  })

  return breadcrumbs
}

function formatSegment(segment: string): string {
  // Convert kebab-case or camelCase to Title Case
  return segment
    .replace(/-/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim()
}
