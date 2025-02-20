"use client"

import { useEffect, useState } from 'react'
import { supabase } from "@/supabase/supabase"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { useRouter } from 'next/navigation'

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setUser(session?.user ?? null)
        if (session?.user) {
          const firstName = session.user.user_metadata.first_name
          const lastName = session.user.user_metadata.last_name
          setUserName(firstName ? `${firstName} ${lastName}` : session.user.email ?? 'User')
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token has been refreshed')
      }
      
      setUser(session?.user ?? null)
      if (session?.user) {
        const firstName = session.user.user_metadata.first_name
        const lastName = session.user.user_metadata.last_name
        setUserName(firstName ? `${firstName} ${lastName}` : session.user.email ?? 'User')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear any local storage
      localStorage.clear()
      setUser(null)
      setUserName('')
      
      // Refresh the page to clear all states
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {userName}</span>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      ) : (
        <LoginModal />
      )}
    </div>
  )
} 
