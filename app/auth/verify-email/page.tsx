'use client'

import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Check Your Email
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a verification link to your email address. Please click the link to verify your account and complete the signup process.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> The link will expire in 24 hours. If you don't see the email, check your spam folder.
          </p>
        </div>

        <Link
          href="/auth/signin"
          className="inline-block py-3 px-6 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
