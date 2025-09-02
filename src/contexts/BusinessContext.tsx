'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Business, BusinessRegistrationData } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'
import { useProfile } from './ProfileContext'

interface BusinessContextType {
  business: Business | null
  loading: boolean
  createBusiness: (data: BusinessRegistrationData) => Promise<{ error: any; business?: Business }>
  updateBusiness: (data: Partial<Business>) => Promise<{ error: any }>
  refreshBusiness: () => Promise<void>
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [lastBusinessId, setLastBusinessId] = useState<string | null>(null)
  const { user } = useAuth()
  const { profile } = useProfile()
  const supabase = createClient()

  const fetchBusiness = async (forceRefresh = false) => {
    if (!user || !profile?.business_id) {
      setBusiness(null)
      setLoading(false)
      setLastBusinessId(null)
      setLastFetchTime(0)
      return
    }

    // Smart caching: Don't fetch if we already have fresh data for this business
    const now = Date.now()
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    const isSameBusiness = lastBusinessId === profile.business_id
    const isDataFresh = (now - lastFetchTime) < CACHE_DURATION
    
    if (!forceRefresh && isSameBusiness && isDataFresh && business) {
      console.log('Business data is fresh, skipping fetch')
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', profile.business_id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business:', error)
      } else {
        setBusiness(data)
        setLastFetchTime(now)
        setLastBusinessId(profile.business_id)
      }
    } catch (error) {
      console.error('Error in fetchBusiness:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshBusiness = async () => {
    await fetchBusiness(true) // Force refresh
  }

  const createBusiness = async (data: BusinessRegistrationData) => {
    if (!user) {
      return { error: { message: 'No user found' } }
    }

    try {
      // Use the database function to create business and update profile
      const { data: businessId, error: functionError } = await supabase
        .rpc('create_business_with_owner', {
          business_name: data.businessName,
          business_description: data.description || null,
          business_website: data.website || null,
          business_industry: data.industry || null,
          business_size: data.size
        })

      if (functionError) {
        return { error: functionError }
      }

      // Fetch the created business
      const { data: newBusiness, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()

      if (fetchError) {
        return { error: fetchError }
      }

      setBusiness(newBusiness)
      return { error: null, business: newBusiness }
    } catch (error) {
      console.error('Error creating business:', error)
      return { error }
    }
  }

  const updateBusiness = async (data: Partial<Business>) => {
    if (!user || !business) {
      return { error: { message: 'No user or business found' } }
    }

    const { error } = await supabase
      .from('businesses')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', business.id)
      .eq('owner_id', user.id) // Extra security check

    if (!error) {
      setBusiness(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null)
    }

    return { error }
  }

  useEffect(() => {
    // Only fetch if business_id changed or we don't have data yet
    if (profile?.business_id !== lastBusinessId || !business) {
      fetchBusiness()
    }
  }, [profile?.business_id, lastBusinessId, business])

  const value = {
    business,
    loading,
    createBusiness,
    updateBusiness,
    refreshBusiness,
  }

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}
