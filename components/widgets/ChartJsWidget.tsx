'use client'

import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Widget } from '@/types'
import { getFieldValue } from '@/utils/fieldExplorer'

interface ChartJsWidgetProps {
  widget: Widget
  data: any
}

export default function ChartJsWidget({ widget, data }: ChartJsWidgetProps) {
  const arrayData = useMemo(() => {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      const possibleKeys = ['data', 'values', 'series', 'items', 'results']
      for (const key of possibleKeys) {
        if (Array.isArray((data as any)[key])) {
          return (data as any)[key]
        }
      }
    }
    return []
  }, [data])

  if (!arrayData || arrayData.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No chart data available. Make sure the API returns an array of data points.
      </div>
    )
  }

  const labels = arrayData.map((item: any, index: number) => {
    const dateField = widget.fields.find(
      (f) =>
        f.type === 'date' ||
        f.key.toLowerCase().includes('date') ||
        f.key.toLowerCase().includes('time')
    )
    if (!dateField) return index + 1
    const value = getFieldValue(item, dateField.path)
    const d = value ? new Date(value) : null
    return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : index + 1
  })

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

  const datasets = valueFields.map((field, index) => {
    const colorPalette = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const color = colorPalette[index % colorPalette.length]
    return {
      label: field.label,
      data: arrayData.map((item: any) => {
        const value = getFieldValue(item, field.path)
        const n = Number(value)
        return isNaN(n) ? 0 : n
      }),
      borderColor: color,
      backgroundColor: `${color}33`,
      tension: 0.3,
      fill: false,
    }
  })

  const chartData = {
    labels,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9ca3af',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#1f2937',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#1f2937',
        },
      },
    },
  }

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  )
}


