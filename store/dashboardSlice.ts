import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Widget, DashboardState } from '@/types'

const initialState: DashboardState = {
  widgets: [],
  layout: [],
  theme: 'light',
}

const STORAGE_KEY = 'finboard-dashboard'

// Load from localStorage
const loadFromStorage = (): DashboardState => {
  if (typeof window === 'undefined') return initialState
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return initialState
}

// Save to localStorage
const saveToStorage = (state: DashboardState) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: loadFromStorage(),
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.widgets.push(action.payload)
      state.layout.push(action.payload.id)
      saveToStorage(state)
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload)
      state.layout = state.layout.filter((id) => id !== action.payload)
      saveToStorage(state)
    },
    updateWidget: (state, action: PayloadAction<Widget>) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id)
      if (index !== -1) {
        state.widgets[index] = action.payload
        saveToStorage(state)
      }
    },
    reorderWidgets: (state, action: PayloadAction<string[]>) => {
      state.layout = action.payload
      saveToStorage(state)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      saveToStorage(state)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      saveToStorage(state)
    },
    importDashboard: (state, action: PayloadAction<DashboardState>) => {
      return { ...action.payload }
    },
    exportDashboard: (state) => {
      return state
    },
  },
})

export const {
  addWidget,
  removeWidget,
  updateWidget,
  reorderWidgets,
  toggleTheme,
  setTheme,
  importDashboard,
  exportDashboard,
} = dashboardSlice.actions

export default dashboardSlice.reducer

