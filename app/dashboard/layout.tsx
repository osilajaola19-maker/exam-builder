'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with hamburger menu */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
