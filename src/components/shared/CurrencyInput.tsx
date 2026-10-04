import { ChangeEvent } from 'react'
import { cn } from '@/lib/utils/cn'

interface CurrencyInputProps {
  value: number | string
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  min?: number
  max?: number
  label?: string
  error?: string
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder = '0.00',
  disabled = false,
  className,
  min = 0,
  max,
  label,
  error,
}: CurrencyInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    const parsed = parseFloat(rawVal)
    if (isNaN(parsed)) {
      onChange(0)
    } else {
      if (max !== undefined && parsed > max) {
        onChange(max)
      } else if (min !== undefined && parsed < min) {
        onChange(min)
      } else {
        onChange(parsed)
      }
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type="number"
          step="any"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pr-3 pl-12 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-100 disabled:text-slate-400',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
        />
        <span className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none">
          ج.م
        </span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  )
}
