'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Widget } from '@/types'
import { getFieldValue } from '@/utils/fieldExplorer'

interface ChartWidgetProps {
  widget: Widget
  data: any
}

export default function ChartWidget({ widget, data }: ChartWidgetProps) {
  const chartData = useMemo(() => {
    // Try to extract array data
    let arrayData: any[] = []
    if (Array.isArray(data)) {
      arrayData = data
    } else if (typeof data === 'object' && data !== null) {
      // Look for common array keys
      const possibleKeys = ['data', 'values', 'series', 'items', 'results']
      for (const key of possibleKeys) {
        if (Array.isArray(data[key])) {
          arrayData = data[key]
          break
        }
      }
      // If not found, try to find first array recursively
      if (arrayData.length === 0) {
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
        const found = findArray(data)
        if (found) arrayData = found
      }
    }

    if (arrayData.length === 0) {
      return []
    }

    // Transform data for chart
    return arrayData.map((item, index) => {
      const chartPoint: any = { index }
      widget.fields.forEach((field) => {
        const value = getFieldValue(item, field.path)
        // Try to find date/time field for X axis
        if (
          field.type === 'date' ||
          field.key.toLowerCase().includes('date') ||
          field.key.toLowerCase().includes('time')
        ) {
          chartPoint.date = value
          chartPoint.name = new Date(value).toLocaleDateString()
        } else {
          chartPoint[field.label] = typeof value === 'number' ? value : parseFloat(value) || 0
        }
      })
      return chartPoint
    })
  }, [data, widget.fields])

  if (chartData.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No chart data available. Make sure the API returns an array of data points.
      </div>
    )
  }

  // Determine which fields to plot
  const valueFields = widget.fields.filter(
    (field) =>
      field.type === 'number' ||
      (!field.key.toLowerCase().includes('date') && !field.key.toLowerCase().includes('time'))
  )

  if (valueFields.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No numeric fields selected for chart
      </div>
    )
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis
            dataKey={chartData[0]?.name ? 'name' : 'index'}
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {valueFields.map((field, index) => (
            <Line
              key={field.key}
              type="monotone"
              dataKey={field.label}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

