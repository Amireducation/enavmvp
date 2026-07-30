"use client"

import { ReactNode, useState } from "react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { Breadcrumbs } from "./breadcrumbs"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

interface AppLayoutProps {
  children: ReactNode
  portalName: string
  portalColor: "emerald" | "blue" | "red" | "amber"
  headerNavItems: { label: string; href: string; icon?: React.ReactNode }[]
  sidebarGroups?: NavGroup[]
  showSidebar?: boolean
  showBreadcrumbs?: boolean
  showSearch?: boolean
  className?: string
}

export function AppLayout({
  children,
  portalName,
  portalColor,
  headerNavItems,
  sidebarGroups,
  showSidebar = false,
  showBreadcrumbs = true,
  showSearch = true,
  className,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        portalName={portalName}
        portalColor={portalColor}
        navItems={headerNavItems}
        showSearch={showSearch}
      />

      <div className="flex flex-1">
        {showSidebar && sidebarGroups && (
          <AppSidebar
            portalColor={portalColor}
            groups={sidebarGroups}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        )}

        <main className={cn("flex-1 flex flex-col", className)}>
          {showBreadcrumbs && (
            <div className="border-b bg-muted/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Breadcrumbs />
              </div>
            </div>
          )}

          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
