'use client'

import { useMemo } from 'react'
import { Widget } from '@/types'
import { getFieldValue, formatValue } from '@/utils/fieldExplorer'

interface FinanceCardWidgetProps {
  widget: Widget
  data: any
}

export default function FinanceCardWidget({ widget, data }: FinanceCardWidgetProps) {
  // Extract values for each field
  const fieldValues = useMemo(() => {
    return widget.fields.map((field) => {
      const value = getFieldValue(data, field.path)
      return {
        ...field,
        value,
        formatted: formatValue(value, field.type),
      }
    })
  }, [data, widget.fields])

  if (fieldValues.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No fields selected for display
      </div>
    )
  }

  // Single card view
  if (fieldValues.length === 1) {
    const field = fieldValues[0]
    return (
      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
        <div className="text-sm opacity-90">{field.label}</div>
        <div className="mt-2 text-3xl font-bold">{field.formatted}</div>
      </div>
    )
  }

  // Multiple cards grid
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fieldValues.map((field) => (
        <div
          key={field.key}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {field.label}
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {field.formatted}
          </div>
        </div>
      ))}
    </div>
  )
}

