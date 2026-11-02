'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          // Exchange code for session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code:', error)
            router.push('/auth/signin?error=auth_failed')
            return
          }

          // Check if user is authenticated
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Redirect to dashboard
            router.push('/dashboard')
          } else {
            router.push('/auth/signin')
          }
        } else {
          // No code, redirect to signin
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/signin?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  )
}
