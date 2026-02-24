import type * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  color?: "green" | "yellow" | "red" | "blue" | "default"
  className?: string
}

const colorStyles = {
  green: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  yellow: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  default: "from-muted/50 to-muted/30 border-border",
}

const iconColors = {
  green: "text-emerald-600 dark:text-emerald-400",
  yellow: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
  blue: "text-blue-600 dark:text-blue-400",
  default: "text-muted-foreground",
}

export function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  color = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-6 bg-gradient-to-br border", colorStyles[color], "card-hover", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {(trend || description) && (
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "flex items-center text-sm font-medium",
                    trend === "up" && "text-emerald-600 dark:text-emerald-400",
                    trend === "down" && "text-red-600 dark:text-red-400",
                    trend === "neutral" && "text-muted-foreground",
                  )}
                >
                  {trend === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                  {trend === "down" && <TrendingDown className="w-4 h-4 mr-1" />}
                  {trend === "neutral" && <Minus className="w-4 h-4 mr-1" />}
                  {trendValue}
                </span>
              )}
              {description && <span className="text-sm text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
        {icon && <div className={cn("p-3 rounded-xl bg-background/50", iconColors[color])}>{icon}</div>}
      </div>
    </Card>
  )
}
