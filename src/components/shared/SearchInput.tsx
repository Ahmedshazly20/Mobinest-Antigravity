import { useState, useEffect, ChangeEvent } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
  autoFocus?: boolean
}

export default function SearchInput({
  value: initialValue = '',
  onChange,
  placeholder = 'ابحث هنا...',
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, debounceMs, onChange])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onChange('')
  }

  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pr-10 pl-9 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute left-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
