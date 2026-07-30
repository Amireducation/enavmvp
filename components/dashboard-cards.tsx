'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon?: LucideIcon
  label: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Icon className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}
      
      {trend && (
        <div className={cn(
          'text-xs font-medium',
          trend.isPositive ? 'text-emerald-600' : 'text-red-600'
        )}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
        </div>
      )}
    </div>
  )
}

interface ActionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  onClick?: () => void
  href?: string
  className?: string
  children?: ReactNode
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  href,
  className,
  children,
}: ActionCardProps) {
  const Component = href ? 'a' : 'button'
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'p-6 rounded-lg border bg-card hover:shadow-lg transition-all hover:border-emerald-300 cursor-pointer text-left',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {children}
        </div>
      </div>
    </Component>
  )
}

interface FormCardProps {
  title: string
  description?: string
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  isLoading?: boolean
}

export function FormCard({
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
}: FormCardProps) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  )
}
