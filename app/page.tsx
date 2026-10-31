'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/auth/signin')
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen animated-gradient">
      <div className="spinner"></div>
    </div>
  )
}
