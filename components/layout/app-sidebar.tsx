"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

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

interface AppSidebarProps {
  portalColor: "emerald" | "blue" | "red" | "amber"
  groups: NavGroup[]
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

const colorMap = {
  emerald: {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500",
    hover: "hover:bg-emerald-500/5",
    badge: "bg-emerald-500 text-white",
  },
  blue: {
    active: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500",
    hover: "hover:bg-blue-500/5",
    badge: "bg-blue-500 text-white",
  },
  red: {
    active: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500",
    hover: "hover:bg-red-500/5",
    badge: "bg-red-500 text-white",
  },
  amber: {
    active: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500",
    hover: "hover:bg-amber-500/5",
    badge: "bg-amber-500 text-white",
  },
}

export function AppSidebar({ portalColor, groups, collapsed: externalCollapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname()
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  
  const collapsed = externalCollapsed ?? internalCollapsed
  const setCollapsed = onCollapsedChange ?? setInternalCollapsed

  const colors = colorMap[portalColor]

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-6">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && !collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 border-l-2 border-transparent rounded-none rounded-r-lg transition-all",
                          collapsed ? "px-4" : "px-3",
                          isActive ? colors.active : colors.hover
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                              <span className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-full",
                                colors.badge
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {collapsed && item.badge && (
                          <span className={cn(
                            "absolute top-1 right-1 w-2 h-2 rounded-full",
                            colors.badge
                          )} />
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Ethiopian Navigator v1.0
          </p>
        </div>
      )}
    </aside>
  )
}
