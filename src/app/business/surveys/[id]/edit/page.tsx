'use client'

import { useAppAuth } from '@/hooks/useAppAuth'
import { SurveyBuilder } from '@/components/business/SurveyBuilder'

interface EditSurveyPageProps {
  params: {
    id: string
  }
}

export default function EditSurveyPage({ params }: EditSurveyPageProps) {
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

  if (!user || !profile || !business) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <SurveyBuilder businessId={business.id} surveyId={params.id} />
    </div>
  )
}
