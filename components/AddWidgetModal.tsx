'use client'

import { useState } from 'react'
import { Widget, WidgetType } from '@/types'
import { fetchApiData } from '@/utils/api'
import { exploreFields } from '@/utils/fieldExplorer'

interface AddWidgetModalProps {
  onClose: () => void
  onAdd: (widget: Widget) => void
}

export default function AddWidgetModal({ onClose, onAdd }: AddWidgetModalProps) {
  const [name, setName] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [widgetType, setWidgetType] = useState<WidgetType>('table')
  const [isTesting, setIsTesting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [apiData, setApiData] = useState<any>(null)

  const handleTest = async () => {
    if (!apiUrl.trim()) {
      setTestError('Please enter an API URL')
      setTestMessage(null)
      return
    }

    setIsTesting(true)
    setTestError(null)
    setTestMessage(null)

    try {
      const response = await fetchApiData(apiUrl.trim(), 0)
      setApiData(response.data)
      setTestMessage('API connection successful.')
    } catch (error: any) {
      setTestError(error.message || 'Failed to connect to API')
    } finally {
      setIsTesting(false)
    }
  }

  const handleAddWidget = async () => {
    if (!name.trim() || !apiUrl.trim()) {
      alert('Please enter widget name and API URL')
      return
    }

    setIsSubmitting(true)

    try {
      let data = apiData
      if (!data) {
        const response = await fetchApiData(apiUrl.trim(), 0)
        data = response.data
        setApiData(data)
      }

      // For table widgets, we want fields from a single row of the main array,
      // with paths relative to each row object so TableWidget can read them.
      const findFirstArray = (value: any): any[] | null => {
        if (Array.isArray(value)) return value
        if (value && typeof value === 'object') {
          for (const key of Object.keys(value)) {
            const found = findFirstArray(value[key])
            if (found) return found
          }
        }
        return null
      }

      const mainArray = findFirstArray(data) || []
      const sampleRow = mainArray[0]

      const fieldSource = sampleRow ? exploreFields(sampleRow) : exploreFields(data)
      if (fieldSource.length === 0) {
        alert('Could not detect any fields in the API response.')
        return
      }

      const selectedFields = fieldSource.slice(0, 5).map((field) => {
        const valueType = field.type === 'number' ? 'number' : 'string'
        return {
          key: field.key,
          label: field.label,
          type: valueType as 'number' | 'string',
          path: field.path,
        }
      })

      const widget: Widget = {
        id: `widget-${Date.now()}`,
        name: name.trim(),
        type: widgetType,
        apiUrl: apiUrl.trim(),
        refreshInterval,
        fields: selectedFields,
        lastUpdated: new Date().toISOString(),
        config: {
          description: `${name.trim()} stocks fetched from API`,
        },
      }

      onAdd(widget)
    } catch (error: any) {
      alert(error.message || 'Failed to create widget')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-lg bg-slate-900 text-white shadow-2xl">
        <div className="border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold">Add New Widget</h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Widget Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., RELIANCE 52 Week High"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">
              API URL
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g., /api/indianapi/52week"
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-700 disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test'}
              </button>
            </div>
            {testMessage && (
              <p className="mt-1 text-xs text-emerald-400">{testMessage}</p>
            )}
            {testError && (
              <p className="mt-1 text-xs text-red-400">{testError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              min={10}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">
              Widget Type
            </label>
            <select
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value as WidgetType)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="table">Table</option>
              <option value="chartjs">Chart (Chart.js)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddWidget}
            disabled={isSubmitting}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Widget'}
          </button>
        </div>
      </div>
    </div>
  )
}


