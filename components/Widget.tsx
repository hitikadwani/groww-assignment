'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removeWidget, updateWidget } from '@/store/dashboardSlice'
import { Widget as WidgetType } from '@/types'
import { fetchApiData } from '@/utils/api'
import TableWidget from './widgets/TableWidget'
import FinanceCardWidget from './widgets/FinanceCardWidget'
import ChartWidget from './widgets/ChartWidget'
import ChartJsWidget from './widgets/ChartJsWidget'
import WidgetConfigPanel from './WidgetConfigPanel'

interface WidgetProps {
  widget: WidgetType
  isLoading?: boolean
  dragHandleProps?: any
}

export default function Widget({ widget, isLoading: externalLoading, dragHandleProps }: WidgetProps) {
  const dispatch = useAppDispatch()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [widget.apiUrl, widget.refreshInterval])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchApiData(widget.apiUrl, widget.refreshInterval * 1000)
      setData(response.data)
      dispatch(
        updateWidget({
          ...widget,
          lastUpdated: new Date(response.timestamp).toISOString(),
          error: undefined,
        })
      )
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data')
      dispatch(
        updateWidget({
          ...widget,
          error: err.message || 'Failed to fetch data',
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this widget?')) {
      dispatch(removeWidget(widget.id))
    }
  }

  const loading = isLoading || externalLoading

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
            ⋮⋮
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{widget.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {widget.config?.description ?? `${widget.name} stocks fetched from API`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfigOpen(true)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            title="Configure"
          >
            ⚙️
          </button>
          <button
            onClick={handleRemove}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        {loading && !data ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : !data ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No data available
          </div>
        ) : (
          <>
            {widget.type === 'table' && <TableWidget widget={widget} data={data} />}
            {widget.type === 'finance-card' && <FinanceCardWidget widget={widget} data={data} />}
            {widget.type === 'chart' && <ChartWidget widget={widget} data={data} />}
            {widget.type === 'chartjs' && <ChartJsWidget widget={widget} data={data} />}
          </>
        )}
      </div>

      {/* Widget Footer */}
      {widget.lastUpdated && (
        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Last updated: {new Date(widget.lastUpdated).toLocaleString()}
        </div>
      )}

      {/* Config Panel */}
      {isConfigOpen && (
        <WidgetConfigPanel
          widget={widget}
          onClose={() => setIsConfigOpen(false)}
          onUpdate={(updatedWidget) => {
            dispatch(updateWidget(updatedWidget))
            setIsConfigOpen(false)
          }}
        />
      )}
    </div>
  )
}

