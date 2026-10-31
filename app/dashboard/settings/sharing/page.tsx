'use client'

import { useState } from 'react'
import { ArrowLeft, Share2, Link as LinkIcon, Eye, Edit, Trash2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Permission = 'readonly' | 'editable'

interface SharedUser {
  id: string
  email: string
  permission: Permission
  sharedAt: string
}

export default function SharingSettings() {
  const [permission, setPermission] = useState<Permission>('readonly')
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([])
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerateLink = () => {
    const link = `${window.location.origin}/shared/${Math.random().toString(36).substring(7)}`
    setGeneratedLink(link)
    toast.success('Share link generated!')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter(u => u.id !== userId))
    toast.success('User access removed')
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sharing Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Share your workspace with friends and control their access permissions
          </p>

          {/* Share Workspace Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Workspace
              </h2>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Access Permission
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPermission('readonly')}
                  className={`border-2 rounded-lg p-4 text-left transition-all ${
                    permission === 'readonly'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Readable Only
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Can view databases, exams, and responses but cannot edit or create
                  </p>
                </button>

                <button
                  onClick={() => setPermission('editable')}
                  className={`border-2 rounded-lg p-4 text-left transition-all ${
                    permission === 'editable'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Editable
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Can create, edit, download databases and exams, full access
                  </p>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Share Link
              </h3>
              {generatedLink ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateLink}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-5 h-5" />
                  Generate Link
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Anyone with this link can access all your databases with the selected permission
              level
            </p>
          </div>

          {/* Shared Users Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shared Users
              </h2>
              <span className="text-sm text-primary-600 font-medium">
                {sharedUsers.length} users
              </span>
            </div>

            {sharedUsers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No shared users yet. Generate a link and share it to collaborate!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sharedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Shared on {user.sharedAt} • {user.permission === 'readonly' ? 'Read only' : 'Can edit'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
