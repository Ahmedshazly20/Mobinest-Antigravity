import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label?: string
    isUp?: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  subtext?: string
  className?: string
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  subtext,
  className,
}: StatsCardProps) {
  const variantClasses = {
    default: 'bg-white border-slate-200 text-slate-900',
    success: 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900',
    warning: 'bg-amber-50/60 border-amber-200/80 text-amber-900',
    danger: 'bg-red-50/60 border-red-200/80 text-red-900',
    info: 'bg-blue-50/60 border-blue-200/80 text-blue-900',
  }

  const iconBgClasses = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  }

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border shadow-xs transition-all hover:shadow-md',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        {icon && (
          <div className={cn('p-3 rounded-xl shrink-0', iconBgClasses[variant])}>
            {icon}
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 font-semibold',
                trend.isUp ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {trend.isUp ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-slate-400 font-normal">{trend.label}</span>
              )}
            </div>
          )}

          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
