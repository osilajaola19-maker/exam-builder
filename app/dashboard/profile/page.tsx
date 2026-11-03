'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { User, Mail, Calendar, Shield, ArrowLeft, Edit2, Check, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setSaving(true)

    try {
      // Update in Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user!.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
        setSaving(false)
        return
      }

      // Update local state - this will update everywhere immediately
      setUser({ ...user!, fullName: fullName.trim() })
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Manage your account information and preferences
            </p>

            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.fullName}
                  </h2>
                  {user?.accountType === 'google' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                      <Shield className="w-3 h-3" />
                      Google Account
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-primary-600" />
                      </button>
                    )}
                  </div>
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false)
                          setFullName(user?.fullName || '')
                        }}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user?.fullName}
                    </p>
                  )}
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.memberSince}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Shield className="w-4 h-4" />
                    Account Type
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {user?.accountType} Account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Help & Support
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                  Need assistance? Contact our support team
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-300">
                      Support Contact: Osilaja Olamiposi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <a
                      href="mailto:osilajaolamiposi18@gmail.com"
                      className="text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      osilajaolamiposi18@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
