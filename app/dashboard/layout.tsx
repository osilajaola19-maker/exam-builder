'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/auth/signin')
        return
      }

      // Set user data
      setUser({
        id: session.user.id,
        email: session.user.email!,
        fullName: session.user.user_metadata.full_name || session.user.email!.split('@')[0],
        avatarUrl: session.user.user_metadata.avatar_url || null,
        accountType: session.user.app_metadata.provider === 'google' ? 'google' : 'email',
        memberSince: new Date(session.user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })

      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/auth/signin')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, setUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen animated-gradient">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
