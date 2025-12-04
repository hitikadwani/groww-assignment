'use client'

import { useMemo, useState } from 'react'
import { Widget } from '@/types'
import { getFieldValue, formatValue } from '@/utils/fieldExplorer'

interface TableWidgetProps {
  widget: Widget
  data: any
}

export default function TableWidget({ widget, data }: TableWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Extract array data
  const arrayData = useMemo(() => {
    if (Array.isArray(data)) {
      return data
    }
    // Try to find first array in data
    const findArray = (obj: any): any[] | null => {
      if (Array.isArray(obj)) return obj
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          const result = findArray(obj[key])
          if (result) return result
        }
      }
      return null
    }
    return findArray(data) || []
  }, [data])

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return arrayData
    const query = searchQuery.toLowerCase()
    return arrayData.filter((item) => {
      return widget.fields.some((field) => {
        const value = getFieldValue(item, field.path)
        return String(value).toLowerCase().includes(query)
      })
    })
  }, [arrayData, searchQuery, widget.fields])

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  if (arrayData.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No table data available. Make sure the API returns an array.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search table..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {widget.fields.map((field) => (
                <th
                  key={field.key}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-700"
              >
                {widget.fields.map((field) => {
                  const value = getFieldValue(item, field.path)
                  return (
                    <td key={field.key} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {formatValue(value, field.type)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}{' '}
            entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

