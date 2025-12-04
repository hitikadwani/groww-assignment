'use client'

import { useState, useMemo } from 'react'
import { exploreFields } from '@/utils/fieldExplorer'
import { FieldOption } from '@/types'
import { WidgetType } from '@/types'

interface FieldSelectorProps {
  data: any
  selectedFields: FieldOption[]
  onFieldsChange: (fields: FieldOption[]) => void
  widgetType: WidgetType
}

export default function FieldSelector({
  data,
  selectedFields,
  onFieldsChange,
  widgetType,
}: FieldSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArraysOnly, setShowArraysOnly] = useState(widgetType === 'table')

  const availableFields = useMemo(() => {
    return exploreFields(data, [], showArraysOnly)
  }, [data, showArraysOnly])

  const filteredFields = useMemo(() => {
    if (!searchQuery) return availableFields
    const query = searchQuery.toLowerCase()
    return availableFields.filter(
      (field) =>
        field.label.toLowerCase().includes(query) ||
        field.key.toLowerCase().includes(query)
    )
  }, [availableFields, searchQuery])

  const toggleField = (field: FieldOption) => {
    const isSelected = selectedFields.some((f) => f.key === field.key)
    if (isSelected) {
      onFieldsChange(selectedFields.filter((f) => f.key !== field.key))
    } else {
      onFieldsChange([...selectedFields, field])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display Mode
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showArraysOnly}
              onChange={(e) => setShowArraysOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show arrays only (for table view)
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Fields
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for fields"
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Available Fields
          </h3>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            {filteredFields.length === 0 ? (
              <p className="p-2 text-sm text-gray-500 dark:text-gray-400">No fields found</p>
            ) : (
              filteredFields.map((field) => {
                const isSelected = selectedFields.some((f) => f.key === field.key)
                return (
                  <button
                    key={field.key}
                    onClick={() => toggleField(field)}
                    className={`w-full rounded p-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                      <span className="font-medium">{field.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({field.type})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{field.key}</div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Selected Fields ({selectedFields.length})
          </h3>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            {selectedFields.length === 0 ? (
              <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
                No fields selected
              </p>
            ) : (
              selectedFields.map((field) => (
                <div
                  key={field.key}
                  className="rounded bg-blue-50 p-2 dark:bg-blue-900/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        {field.label}
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-400">{field.key}</div>
                    </div>
                    <button
                      onClick={() => toggleField(field)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

