'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/store/store'
import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.dashboard.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  )
}

