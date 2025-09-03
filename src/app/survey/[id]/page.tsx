'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Survey, SurveyQuestion } from '@/types'
import { supabase } from '@/lib/supabase'
import { SurveyResponseForm } from '@/components/survey/SurveyResponseForm'
import { SurveyLoading } from '@/components/survey/SurveyLoading'
import { SurveyNotFound } from '@/components/survey/SurveyNotFound'
import { SurveyCompleted } from '@/components/survey/SurveyCompleted'

export default function SurveyResponsePage() {
  const params = useParams()
  const surveyId = params.id as string
  
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch survey data - only active surveys can be responded to
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select(`
            id,
            title,
            description,
            survey_data,
            settings,
            status,
            business_id,
            response_count,
            created_by,
            created_at,
            updated_at,
            businesses (
              name,
              logo_url
            )
          `)
          .eq('id', surveyId)
          .eq('status', 'active')
          .single()

        if (surveyError) {
          console.error('Survey fetch error:', surveyError)
          setError('Survey not found or no longer available')
          return
        }

        if (!surveyData) {
          setError('Survey not found')
          return
        }

        // Transform the businesses array to a single object since we expect one business per survey
        const transformedSurvey = {
          ...surveyData,
          businesses: Array.isArray(surveyData.businesses) && surveyData.businesses.length > 0 
            ? surveyData.businesses[0] 
            : surveyData.businesses
        }
        
        setSurvey(transformedSurvey)
      } catch (err) {
        console.error('Error fetching survey:', err)
        setError('Failed to load survey')
      } finally {
        setLoading(false)
      }
    }

    if (surveyId) {
      fetchSurvey()
    }
  }, [surveyId])

  const handleSurveyComplete = () => {
    setIsCompleted(true)
  }

  if (loading) {
    return <SurveyLoading />
  }

  if (error || !survey) {
    return <SurveyNotFound error={error} />
  }

  if (isCompleted) {
    return <SurveyCompleted survey={survey} />
  }

  return (
    <SurveyResponseForm 
      survey={survey} 
      onComplete={handleSurveyComplete}
    />
  )
}
