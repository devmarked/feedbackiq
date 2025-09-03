'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UserRoleType } from '@/types'
import { createClient } from '@/lib/supabase/client'

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Australia', 'New Zealand', 'Japan',
  'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
]

export default function ProfileSetupPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    country: '',
    bio: '',
    role: 'business' as UserRoleType,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  const loading = authLoading || profileLoading || isRedirecting

  useEffect(() => {
    if (authLoading || profileLoading) return

    console.log('Profile setup useEffect:', {
      user: user?.email,
      emailConfirmed: user?.email_confirmed_at,
      profile: profile ? {
        username: profile.username,
        fullName: profile.full_name,
        hasRequiredFields: profile.username !== null && profile.full_name !== null
      } : null,
      authLoading,
      profileLoading
    })

    // Add a small delay to prevent race conditions
    const timer = setTimeout(() => {
      // Redirect if not authenticated
      if (!user) {
        console.log('No user, redirecting to auth')
        setIsRedirecting(true)
        router.push('/auth')
        return
      }

      // Check if user's email is confirmed
      if (!user.email_confirmed_at) {
        console.log('Email not confirmed, redirecting to auth')
        setIsRedirecting(true)
        router.push('/auth')
        return
      }

      // If profile exists and has required fields, redirect to business setup
      if (profile && profile.username !== null && profile.full_name !== null) {
        console.log('Profile complete, redirecting to business setup')
        setIsRedirecting(true)
        router.push('/business/setup')
        return
      }

      console.log('Showing profile setup form')

      // Pre-fill form with existing profile data if available
      if (profile) {
        setFormData({
          username: profile.username || '',
          full_name: profile.full_name || '',
          country: profile.country || '',
          bio: profile.bio || '',
          role: profile.role || 'business',
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, profile, authLoading, profileLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validate required fields
    if (!formData.username.trim()) {
      setError('Username is required')
      setIsSubmitting(false)
      return
    }

    if (!formData.full_name.trim()) {
      setError('Full name is required')
      setIsSubmitting(false)
      return
    }

    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await updateProfile(formData)

      if (error) {
        setError(error.message)
      } else {
        // Mark profile setup as complete in user metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { profile_setup_complete: true }
        })

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError)
        }

        // Redirect to business setup
        router.push('/business/setup')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }

    setIsSubmitting(false)
  }

  // Show loading state while authentication/profile is loading or while redirecting
  if (loading && !user) {
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

  // Don't render anything if user is not authenticated
  if (!user) {
    return null // Will redirect via useEffect
  }

  // Don't render if profile is complete
  if (profile && profile.username && profile.full_name) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <img 
            src="/images/logo-clean.png" 
            alt="Welcome to FeedbackIQ" 
            className="mx-auto h-32 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to FeedbackIQ!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your business profile to get started
          </p>
        </div>

        {/* Profile Setup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a unique username"
                  required
                />
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm items-center">
                  Business Owner
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Create and manage surveys for your business
                </p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself... (optional)"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
