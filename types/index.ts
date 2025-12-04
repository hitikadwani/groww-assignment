export type WidgetType = 'table' | 'finance-card' | 'chart' | 'chartjs'

export type ChartType = 'line' | 'candle'

export type DisplayMode = 'card' | 'table' | 'chart'

export interface WidgetField {
  key: string
  label: string
  type?: 'string' | 'number' | 'date' | 'currency' | 'percentage'
  path: string[]
}

export interface Widget {
  id: string
  name: string
  type: WidgetType
  apiUrl: string
  refreshInterval: number // in seconds
  fields: WidgetField[]
  displayMode?: DisplayMode
  chartType?: ChartType
  chartInterval?: 'daily' | 'weekly' | 'monthly'
  config?: {
    showArraysOnly?: boolean
    [key: string]: any
  }
  lastUpdated?: string
  error?: string
}

export interface DashboardState {
  widgets: Widget[]
  layout: string[] // widget IDs in order
  theme: 'light' | 'dark'
}

export interface ApiResponse {
  data: any
  timestamp: number
  cached: boolean
}

export interface FieldOption {
  key: string
  label: string
  type: string
  path: string[]
  value: any
}

