'use client'

import { useState } from 'react'
import { Widget, FieldOption } from '@/types'
import { fetchApiData } from '@/utils/api'
import { exploreFields } from '@/utils/fieldExplorer'
import FieldSelector from './FieldSelector'

interface WidgetConfigPanelProps {
  widget: Widget
  onClose: () => void
  onUpdate: (widget: Widget) => void
}

export default function WidgetConfigPanel({
  widget,
  onClose,
  onUpdate,
}: WidgetConfigPanelProps) {
  const [name, setName] = useState(widget.name)
  const [apiUrl, setApiUrl] = useState(widget.apiUrl)
  const [refreshInterval, setRefreshInterval] = useState(widget.refreshInterval)
  const [selectedFields, setSelectedFields] = useState<FieldOption[]>(
    widget.fields.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type ?? 'string',
      path: field.path,
      value: null,
    }))
  )
  const [apiData, setApiData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const handleLoadFields = async () => {
    setIsLoadingData(true)
    try {
      const response = await fetchApiData(apiUrl, 0)
      setApiData(response.data)
    } catch (error) {
      alert('Failed to load API data')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSave = () => {
    const updatedWidget: Widget = {
      ...widget,
      name,
      apiUrl,
      refreshInterval,
      fields: selectedFields.map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type === 'number' ? 'number' : 'string',
        path: field.path,
      })),
    }
    onUpdate(updatedWidget)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configure Widget
          </h2>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Widget Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              API URL
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleLoadFields}
                disabled={isLoadingData}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoadingData ? 'Loading...' : 'Load Fields'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              min="10"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {apiData && (
            <FieldSelector
              data={apiData}
              selectedFields={selectedFields}
              onFieldsChange={setSelectedFields}
              widgetType={widget.type}
            />
          )}
        </div>

        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

