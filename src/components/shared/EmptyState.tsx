import { ReactNode } from 'react'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  title = 'لا توجد بيانات متاحة',
  description = 'لم يتم العثور على أي عناصر لعرضها في الوقت الحالي.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 min-h-[260px]',
        className
      )}
    >
      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
