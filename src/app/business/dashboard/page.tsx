'use client'

import { useAppAuth } from '@/hooks/useAppAuth'
import { BusinessHeader } from '@/components/business/BusinessHeader'
import { SurveyOverview } from '@/components/business/SurveyOverview'
import { QuickActions } from '@/components/business/QuickActions'
import { RecentActivity } from '@/components/business/RecentActivity'

export default function BusinessDashboard() {
  const { user, profile, business, loading } = useAppAuth({ 
    requiredRole: 'business',
    requireBusiness: true 
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect via useBusinessAuth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Business Header */}
        <BusinessHeader business={business} />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column - Survey Overview */}
          <div className="lg:col-span-8 space-y-6">
            <SurveyOverview />
            <RecentActivity />
          </div>
          
          {/* Right Column - Quick Actions & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
