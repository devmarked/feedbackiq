'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { useBusiness } from '@/contexts/BusinessContext'
import { UserRoleType } from '@/types'

interface UseAppAuthOptions {
  requiredRole?: UserRoleType | UserRoleType[]
  redirectTo?: string
  requireBusiness?: boolean
  requireProfile?: boolean
}

export function useAppAuth(options: UseAppAuthOptions = {}) {
  const { 
    requiredRole, 
    redirectTo = '/auth', 
    requireBusiness = false,
    requireProfile = true
  } = options
  
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { business, loading: businessLoading } = useBusiness()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  // Wait for ALL data to load before making any decisions
  const loading = authLoading || profileLoading || (requireBusiness ? businessLoading : false) || isRedirecting

  useEffect(() => {
    // Don't make any decisions until all required data is loaded
    if (authLoading || profileLoading || (requireBusiness && businessLoading)) {
      return
    }

    // Additional safety: Ensure we have the data we need
    if (requireProfile && user && !profile) {
      // User exists but profile is null - this can happen during the transition
      // when user loads but profile hasn't been fetched yet
      console.log('User exists but profile is null, waiting for profile to load...')
      return
    }

    // Only run auth checks once per data load
    if (hasCheckedAuth) {
      return
    }

    setHasCheckedAuth(true)

    // Redirect if not authenticated
    if (!user) {
      setIsRedirecting(true)
      router.push(redirectTo)
      return
    }

    // Only check profile if required
    if (requireProfile) {
      // Redirect if profile not found or incomplete
      if (!profile) {
        setIsRedirecting(true)
        router.push('/profile/setup')
        return
      }

      // Redirect if profile is incomplete (missing required fields)
      // Only redirect if the profile was just created with null values
      if (profile.username === null || profile.full_name === null) {
        setIsRedirecting(true)
        router.push('/profile/setup')
        return
      }

      // Check role requirements
      if (requiredRole && profile) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        if (!allowedRoles.includes(profile.role)) {
          setIsRedirecting(true)
          router.push('/unauthorized')
          return
        }
      }

      // Check business requirement
      if (requireBusiness && profile && profile.role === 'business' && !profile.business_id) {
        setIsRedirecting(true)
        router.push('/business/setup')
        return
      }
    }
  }, [user, profile, business, authLoading, profileLoading, businessLoading, requiredRole, requireBusiness, requireProfile, redirectTo, router, hasCheckedAuth])

  // Reset the check flag when dependencies change
  useEffect(() => {
    setHasCheckedAuth(false)
  }, [user?.id, profile?.id, business?.id])

  const hasRole = (role: UserRoleType | UserRoleType[]): boolean => {
    if (!profile) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(profile.role)
  }

  const canAccessBusiness = (businessId?: string): boolean => {
    if (!profile) return false
    
    // Admin can access any business
    if (profile.role === 'admin') return true
    
    // Business owner can access their own business
    if (profile.role === 'business' && profile.business_id) {
      return !businessId || profile.business_id === businessId
    }
    
    return false
  }

  const canCreateSurvey = (): boolean => {
    return hasRole(['admin', 'business']) && 
           (profile?.role === 'admin' || !!profile?.business_id)
  }

  const canViewAnalytics = (businessId?: string): boolean => {
    return canAccessBusiness(businessId)
  }

  const canManageUsers = (): boolean => {
    return hasRole('admin')
  }

  return {
    user,
    profile,
    business,
    loading,
    hasRole,
    canAccessBusiness,
    canCreateSurvey,
    canViewAnalytics,
    canManageUsers,
    isAuthenticated: !!user,
    isBusinessOwner: profile?.role === 'business' && !!profile.business_id,
    isAdmin: profile?.role === 'admin',
  }
}
