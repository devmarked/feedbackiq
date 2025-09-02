'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAppAuth } from '@/hooks/useAppAuth'
import { Survey, SurveyResponse, SurveyQuestion } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SurveyResponseDataTable } from '@/components/business/SurveyResponseDataTable'
import { SurveyAnalytics } from '@/components/business/SurveyAnalytics'
import { Sparkles } from 'lucide-react'

export default function SurveyResponsesPage() {
  const { id } = useParams<{ id: string }>()
  const { user, profile, business, loading } = useAppAuth({ requiredRole: 'business', requireBusiness: true })
  const supabase = createClient()

  const [survey, setSurvey] = useState<Survey | null>(null)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [status, setStatus] = useState<'all' | 'complete' | 'partial'>('all')

  useEffect(() => {
    if (!id || !business?.id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [{ data: surveyData, error: surveyError }, { data: responseData, error: responseError }] = await Promise.all([
          supabase.from('surveys').select('*').eq('id', id as string).single(),
          supabase
            .from('survey_responses')
            .select('*')
            .eq('survey_id', id as string)
            .order('submitted_at', { ascending: false })
        ])

        if (surveyError) throw surveyError
        if (responseError) throw responseError

        const s = surveyData as unknown as Survey
        setSurvey(s)
        const qs = Array.isArray(s?.survey_data?.questions) ? (s.survey_data.questions as SurveyQuestion[]) : []
        setQuestions(qs)
        setResponses((responseData || []) as unknown as SurveyResponse[])
      } catch (e: any) {
        setError(e?.message || 'Failed to load survey responses')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, business?.id])

  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const submitted = new Date(r.submitted_at)
      if (startDate) {
        const s = new Date(startDate)
        if (submitted < s) return false
      }
      if (endDate) {
        const e = new Date(endDate)
        // include end date full day
        e.setHours(23,59,59,999)
        if (submitted > e) return false
      }
      if (status === 'complete' && !r.is_complete) return false
      if (status === 'partial' && r.is_complete) return false
      return true
    })
  }, [responses, startDate, endDate, status])

  const analytics = useMemo(() => {
    const total = filteredResponses.length
    const completed = filteredResponses.filter(r => r.is_complete).length
    const avgCompletionTime = filteredResponses.length
      ? Math.round(
          filteredResponses.reduce((sum, r) => sum + (r.completion_time || 0), 0) / filteredResponses.length
        )
      : 0
    return { total, completed, completionRate: total ? Math.round((completed / total) * 100) : 0, avgCompletionTime }
  }, [filteredResponses])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="text-red-600 mb-4">{error}</div>
          <Link href="/business/surveys">
            <Button variant="outline">Back to surveys</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-4xl font-bold text-gray-900">Response</h1>
            <p className="text-lg text-gray-600 mt-3">
            View individual responses and analytics in one place.
            </p>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link href="/business/surveys/create">
              <div className="relative inline-block">
                <Button 
                  className="relative text-base px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slide" 
                       style={{
                         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                         backgroundSize: '200% 100%',
                         animation: 'shimmer-slide 2s infinite linear'
                       }}
                  />
                  <div className="relative z-10 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Insights
                  </div>
                </Button>
              </div>
            </Link>
            
          </div>
        </div>

        <SurveyAnalytics
          totalResponses={analytics.total}
          completedResponses={analytics.completed}
          completionRatePercent={analytics.completionRate}
          averageCompletionSeconds={analytics.avgCompletionTime}
        />

        <div className="max-w-full overflow-auto" style={{ maxHeight: '70vh' }}>
          <SurveyResponseDataTable responses={filteredResponses} questions={questions} />
        </div>
      </div>
    </div>
  )
}


