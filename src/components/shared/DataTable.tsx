import React, { useState, useMemo } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import SearchInput from './SearchInput'
import { cn } from '@/lib/utils/cn'

export interface Column<T> {
  key: string
  header: string
  accessorKey?: keyof T | string
  render?: (row: T, index: number) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchableKeys?: (keyof T | string)[]
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  headerActions?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  pageSize?: number
  className?: string
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'ابحث في البيانات...',
  searchableKeys = [],
  onRowClick,
  actions,
  headerActions,
  emptyTitle,
  emptyDescription,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // 1. Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase().trim()
    return data.filter((row) => {
      if (searchableKeys.length > 0) {
        return searchableKeys.some((key) => {
          const val = row[key as string]
          return val !== null && val !== undefined && String(val).toLowerCase().includes(query)
        })
      }

      // Default search across all string/number fields
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false
        if (typeof val === 'object') return false
        return String(val).toLowerCase().includes(query)
      })
    })
  }, [data, searchQuery, searchableKeys])

  // 2. Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal), 'ar')
        : String(bVal).localeCompare(String(aVal), 'ar')
    })
  }, [filteredData, sortKey, sortDirection])

  // 3. Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        setSortKey(null)
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden', className)}>
      {/* Table Toolbar */}
      {(searchableKeys.length > 0 || headerActions) && (
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          {searchableKeys.length > 0 ? (
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val)
                setCurrentPage(1)
              }}
              placeholder={searchPlaceholder}
            />
          ) : (
            <div />
          )}

          {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
            <tr>
              {columns.map((col) => {
                const colKey = col.accessorKey || col.key
                const isSorted = sortKey === colKey

                return (
                  <th
                    key={col.key}
                    className={cn('px-4 py-3.5 whitespace-nowrap', col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(colKey as string)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors font-semibold"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                )
              })}

              {actions && (
                <th className="px-4 py-3.5 text-center whitespace-nowrap">الإجراءات</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <LoadingSpinner label="جاري تحميل البيانات..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-none bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'hover:bg-slate-50/80 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3.5 whitespace-nowrap', col.className)}>
                      {col.render
                        ? col.render(row, (currentPage - 1) * pageSize + rowIndex)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '-')
                        : '-'}
                    </td>
                  ))}

                  {actions && (
                    <td
                      className="px-4 py-3.5 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            عرض {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} إلى{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} من إجمالي {sortedData.length}{' '}
            سجل
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="الصفحة الأولى"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="px-3 font-semibold text-slate-700">
              صفحة {currentPage} من {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="الصفحة الأخيرة"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
