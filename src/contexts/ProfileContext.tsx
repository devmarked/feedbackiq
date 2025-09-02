'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { UserProfile, ProfileUpdateData } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'

interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  updateProfile: (data: ProfileUpdateData) => Promise<{ error: any }>
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>
  deleteAccount: () => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [lastUserId, setLastUserId] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchProfile = async (forceRefresh = false) => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      setLastUserId(null)
      setLastFetchTime(0)
      return
    }

    // Smart caching: Don't fetch if we already have fresh data for this user
    const now = Date.now()
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    const isSameUser = lastUserId === user.id
    const isDataFresh = (now - lastFetchTime) < CACHE_DURATION
    
    if (!forceRefresh && isSameUser && isDataFresh && profile) {
      console.log('Profile data is fresh, skipping fetch')
      setLoading(false)
      return
    }

    // Set loading to true when we start fetching
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              username: null,
              full_name: null,
              country: null,
              avatar_url: null,
              bio: null,
              role: 'user',
            },
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
        } else {
          setProfile(newProfile)
          setLastFetchTime(now)
          setLastUserId(user.id)
        }
      } else if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
        setLastFetchTime(now)
        setLastUserId(user.id)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    await fetchProfile(true) // Force refresh
  }

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user || !profile) {
      return { error: { message: 'No user or profile found' } }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null)
    }

    return { error }
  }

  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { error: { message: 'No user found' } }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      return { error: uploadError }
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const avatarUrl = data.publicUrl

    // Update profile with new avatar URL
    const { error: updateError } = await updateProfile({ avatar_url: avatarUrl })

    return { error: updateError, url: avatarUrl }
  }

  const deleteAccount = async () => {
    if (!user) {
      return { error: { message: 'No user found' } }
    }

    // Delete profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id)

    if (profileError) {
      return { error: profileError }
    }

    // Delete user account (this will also handle auth cleanup)
    const { error: userError } = await supabase.auth.admin.deleteUser(user.id)

    return { error: userError }
  }

  useEffect(() => {
    // Only fetch if user changed or we don't have data yet
    if (user?.id !== lastUserId || !profile) {
      fetchProfile()
    }
  }, [user?.id, lastUserId, profile])

  const value = {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    refreshProfile,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
