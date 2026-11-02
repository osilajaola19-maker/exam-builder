'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Lock, Eye, EyeOff, Sun, Moon, Monitor, Check } from 'lucide-react'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import toast from 'react-hot-toast'
import { useStore, ThemeMode, ThemeColor } from '@/lib/store'

const themeColors = [
  { name: 'Blue', value: 'blue' as ThemeColor, color: 'bg-blue-600' },
  { name: 'Purple', value: 'purple' as ThemeColor, color: 'bg-purple-600' },
  { name: 'Green', value: 'green' as ThemeColor, color: 'bg-green-600' },
  { name: 'Orange', value: 'orange' as ThemeColor, color: 'bg-orange-600' },
  { name: 'Pink', value: 'pink' as ThemeColor, color: 'bg-pink-600' },
]

export default function Settings() {
  const { theme, setTheme, themeColor, setThemeColor } = useStore()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await authService.updatePassword(formData.newPassword)
      toast.success('Password updated! Check your email for confirmation.')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

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

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Theme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Accent Color
            </h3>
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

        {/* Password Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Change Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
