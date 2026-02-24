import type * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-muted-foreground text-pretty max-w-2xl">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
