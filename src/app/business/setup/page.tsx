'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { BusinessRegistrationForm } from '@/components/business/BusinessRegistrationForm'
import { useRouter } from 'next/navigation'

export default function BusinessSetupPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const loading = authLoading || profileLoading || isRedirecting

  useEffect(() => {
    if (authLoading || profileLoading) return

    // Add a small delay to prevent race conditions
    const timer = setTimeout(() => {
      // Redirect if not authenticated
      if (!user) {
        setIsRedirecting(true)
        router.push('/auth')
        return
      }

      // Redirect if no profile or incomplete profile
      if (!profile || profile.username === null || profile.full_name === null) {
        setIsRedirecting(true)
        router.push('/profile/setup')
        return
      }

      // If user already has a business, redirect to dashboard
      if (profile.business_id) {
        setIsRedirecting(true)
        router.push('/business/dashboard')
        return
      }

      // If user is not business role, they shouldn't be here
      if (profile.role !== 'business' && profile.role !== 'user') {
        setIsRedirecting(true)
        router.push('/dashboard')
        return
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [user, profile, authLoading, profileLoading, router])

  // Show loading state while authentication/profile is loading or while redirecting
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">
            {isRedirecting ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Don't render the form if conditions aren't met
  if (!user || !profile || profile.business_id || (profile.role !== 'business' && profile.role !== 'user')) {
    return null // Will redirect via useEffect
  }

  return <BusinessRegistrationForm />
}
