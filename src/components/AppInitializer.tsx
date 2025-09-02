'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'

interface AppInitializerProps {
  children: React.ReactNode
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Wait for both auth and profile contexts to finish loading
    if (!authLoading && !profileLoading) {
      // Add a small delay to ensure all contexts are properly initialized
      const timer = setTimeout(() => {
        setIsInitialized(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [authLoading, profileLoading])

  // Show loading screen while contexts are initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
