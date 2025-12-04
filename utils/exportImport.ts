import { DashboardState } from '@/types'

export const exportDashboard = (state: DashboardState): string => {
  return JSON.stringify(state, null, 2)
}

export const importDashboard = (jsonString: string): DashboardState => {
  try {
    const parsed = JSON.parse(jsonString)
    // Validate structure
    if (
      parsed &&
      Array.isArray(parsed.widgets) &&
      Array.isArray(parsed.layout) &&
      ['light', 'dark'].includes(parsed.theme)
    ) {
      return parsed as DashboardState
    }
    throw new Error('Invalid dashboard configuration format')
  } catch (error) {
    throw new Error('Failed to parse dashboard configuration')
  }
}

export const downloadDashboard = (state: DashboardState, filename: string = 'finboard-config.json') => {
  const jsonString = exportDashboard(state)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

