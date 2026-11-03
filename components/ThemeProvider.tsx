'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useStore()

  const applyTheme = (mode: string) => {
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  useEffect(() => {
    if (theme === 'system') {
      // Apply device theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(isDark ? 'dark' : 'light')

      // Listen for device theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        // Only auto-change if still on system mode
        const currentTheme = useStore.getState().theme
        if (currentTheme === 'system') {
          applyTheme(e.matches ? 'dark' : 'light')
        }
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  return <>{children}</>
}
