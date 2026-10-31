'use client'

import { useStore, ThemeMode, ThemeColor } from '@/lib/store'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const themeColors = [
  { name: 'Blue', value: 'blue' as ThemeColor, color: 'bg-blue-600' },
  { name: 'Purple', value: 'purple' as ThemeColor, color: 'bg-purple-600' },
  { name: 'Green', value: 'green' as ThemeColor, color: 'bg-green-600' },
  { name: 'Orange', value: 'orange' as ThemeColor, color: 'bg-orange-600' },
  { name: 'Pink', value: 'pink' as ThemeColor, color: 'bg-pink-600' },
]

export default function ThemeSettings() {
  const { theme, setTheme, themeColor, setThemeColor } = useStore()

  useEffect(() => {
    // Apply theme
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Choose Theme
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => setTheme('light')}
              className={`relative border-2 rounded-xl p-6 transition-all ${
                theme === 'light'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {theme === 'light' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="w-16 h-16 bg-white border border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Light Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clean and bright interface
              </p>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`relative border-2 rounded-xl p-6 transition-all ${
                theme === 'dark'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {theme === 'dark' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Moon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Dark Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Easy on the eyes in low light
              </p>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`relative border-2 rounded-xl p-6 transition-all ${
                theme === 'system'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {theme === 'system' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-900 border border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">System</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follows your device preference
              </p>
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Theme Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    💡 Light Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Perfect for daytime use and well-lit environments. Provides maximum
                    contrast and readability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    🌙 Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reduces eye strain in low-light conditions and saves battery on OLED
                    displays.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    🖥️ System Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically switches between light and dark modes based on your device's
                    system preference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Accent Color
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setThemeColor(color.value)}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    themeColor === color.value
                      ? 'border-gray-900 dark:border-white'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {themeColor === color.value && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white dark:text-gray-900" />
                    </div>
                  )}
                  <div className={`w-full h-12 ${color.color} rounded mb-2`}></div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
