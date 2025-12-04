'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { reorderWidgets, removeWidget, toggleTheme, addWidget, importDashboard } from '@/store/dashboardSlice'
import { downloadDashboard, importDashboard as parseDashboardConfig } from '@/utils/exportImport'
import Widget from './Widget'
import AddWidgetModal from './AddWidgetModal'
import { fetchApiData } from '@/utils/api'
import { Widget as WidgetType } from '@/types'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const dashboardState = useAppSelector((state) => state.dashboard)
  const { widgets, layout, theme } = dashboardState
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loadingWidgets, setLoadingWidgets] = useState<Set<string>>(new Set())
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Fetch data for all widgets on mount and when refresh intervals are met
  useEffect(() => {
    const fetchAllWidgets = async () => {
      for (const widget of widgets) {
        if (widget.refreshInterval > 0) {
          await fetchWidgetData(widget.id)
        }
      }
    }

    fetchAllWidgets()

    // Set up interval timers for each widget
    const intervals: NodeJS.Timeout[] = []
    widgets.forEach((widget) => {
      if (widget.refreshInterval > 0) {
        const interval = setInterval(() => {
          fetchWidgetData(widget.id)
        }, widget.refreshInterval * 1000)
        intervals.push(interval)
      }
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [widgets.length])

  const fetchWidgetData = async (widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId)
    if (!widget) return

    setLoadingWidgets((prev) => new Set(prev).add(widgetId))
    try {
      const response = await fetchApiData(widget.apiUrl, widget.refreshInterval * 1000)
      // Data is cached in the API utility, widgets will fetch it when rendering
    } catch (error) {
      console.error(`Error fetching data for widget ${widgetId}:`, error)
    } finally {
      setLoadingWidgets((prev) => {
        const newSet = new Set(prev)
        newSet.delete(widgetId)
        return newSet
      })
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(layout)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    dispatch(reorderWidgets(items))
  }

  const orderedWidgets = layout
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is WidgetType => w !== undefined)

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Finance Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} / Real-time data
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => downloadDashboard(dashboardState)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Export
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Import
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Add Widget
            </button>
          </div>
        </div>

        {/* Widgets Grid */}
        {orderedWidgets.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
              No widgets yet. Connect to a finance API and create your first widget
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Add Widget
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {orderedWidgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${
                            snapshot.isDragging ? 'shadow-2xl' : ''
                          } transition-shadow`}
                        >
                          <Widget
                            widget={widget}
                            isLoading={loadingWidgets.has(widget.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Add Widget Modal */}
        {isAddModalOpen && (
          <AddWidgetModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(widget) => {
              dispatch(addWidget(widget))
              setIsAddModalOpen(false)
            }}
          />
        )}

        {/* Import Modal */}
        {isImportModalOpen && (
          <ImportModal
            onClose={() => setIsImportModalOpen(false)}
            onImport={(jsonString) => {
              try {
                const importedState = parseDashboardConfig(jsonString)
                dispatch(importDashboard(importedState))
                setIsImportModalOpen(false)
                alert('Dashboard imported successfully!')
              } catch (error: any) {
                alert(`Failed to import: ${error.message}`)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

// Import Modal Component
function ImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void
  onImport: (jsonString: string) => void
}) {
  const [jsonString, setJsonString] = useState('')

  const handleImport = () => {
    if (!jsonString.trim()) {
      alert('Please paste the dashboard configuration JSON')
      return
    }
    onImport(jsonString)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import Dashboard</h2>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste dashboard configuration JSON:
          </label>
          <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            rows={10}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder='{"widgets": [...], "layout": [...], "theme": "light"}'
          />
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
              onClick={handleImport}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

