'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAppAuth } from '@/hooks/useAppAuth'
import { Survey, SurveyResponse, SurveyQuestion, AIFormattedSurveyData, SurveyAnalysis, AIInsight } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SurveyResponseDataTable } from '@/components/business/SurveyResponseDataTable'
import { SurveyAnalytics } from '@/components/business/SurveyAnalytics'
import { SurveyAIInsights } from '@/components/business/SurveyAIInsights'
import { AIInsightsModal } from '@/components/business/AIInsightsModal'
import { Sparkles, Eye } from 'lucide-react'
import { fetchAndFormatSurveyDataForAI } from '@/lib/utils/survey-ai-formatter'

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
  const [aiFormattedData, setAiFormattedData] = useState<AIFormattedSurveyData | null>(null)
  const [aiInsights, setAiInsights] = useState<SurveyAnalysis | null>(null)
  const [savedInsight, setSavedInsight] = useState<AIInsight | null>(null)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Function to manually trigger AI data formatting
  const handleGenerateAIData = async () => {
    if (!id) return
    
    try {
      const result = await fetchAndFormatSurveyDataForAI(id as string, supabase)
      if (result.success && result.data) {
        setAiFormattedData(result.data)
        console.log('AI Data Generated:', result.data)
      } else {
        console.error('Failed to generate AI data:', result.error)
      }
    } catch (error) {
      console.error('Error generating AI data:', error)
    }
  }

  // Function to load saved AI insights
  const loadSavedAIInsights = async () => {
    if (!id) return
    
    try {
      setIsLoadingInsights(true)
      setError(null)
      
      const response = await fetch(`/api/surveys/${id}/ai-insights`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load AI insights')
      }

      if (result.success && result.data) {
        setSavedInsight(result.data)
        setAiInsights(result.data.analysis_data)
        console.log('Saved AI Insights Loaded:', result.data)
      }
    } catch (error: any) {
      console.error('Error loading AI insights:', error)
      // Don't set error for loading - it's optional
    } finally {
      setIsLoadingInsights(false)
    }
  }

  // Function to open AI insights modal
  const handleViewAIInsights = () => {
    if (aiInsights) {
      setIsModalOpen(true)
    }
  }

  // Function to generate AI insights
  const handleGenerateAIInsights = async () => {
    if (!id) return
    
    try {
      setIsGeneratingInsights(true)
      setError(null)
      
      const response = await fetch(`/api/surveys/${id}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate AI insights')
      }

      if (result.success && result.data) {
        setAiInsights(result.data)
        setSavedInsight(result.saved ? { id: result.insight_id } as AIInsight : null)
        console.log('AI Insights Generated:', result.data)
        // Auto-open modal after generating insights
        setIsModalOpen(true)
      } else {
        throw new Error(result.error || 'Failed to generate insights')
      }
    } catch (error: any) {
      console.error('Error generating AI insights:', error)
      setError(error.message || 'Failed to generate AI insights')
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  useEffect(() => {
    if (!id || !business?.id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch and format survey data for AI processing
        const result = await fetchAndFormatSurveyDataForAI(id as string, supabase)
        
        if (!result.success) {
          throw new Error(result.error)
        }

        const s = result.survey as Survey
        setSurvey(s)
        const qs = Array.isArray(s?.survey_data?.questions) ? (s.survey_data.questions as SurveyQuestion[]) : []
        setQuestions(qs)
        setResponses((result.responses || []) as SurveyResponse[])

        // Store and console log the formatted data for AI
        if (result.data) {
          setAiFormattedData(result.data)
          console.log('Survey Data Formatted for AI:', result.data)
        }

        // Load saved AI insights if available
        await loadSavedAIInsights()
        
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
            <div className="flex gap-3">
              {aiInsights ? (
                <Button 
                  onClick={handleViewAIInsights}
                  className="relative text-base px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slide" 
                       style={{
                         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                         backgroundSize: '200% 100%',
                         animation: 'shimmer-slide 2s infinite linear'
                       }}
                  />
                  <div className="relative z-10 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    View AI Insights
                  </div>
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerateAIInsights}
                  disabled={isGeneratingInsights}
                  className="relative text-base px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {isGeneratingInsights ? 'Generating Insights...' : 'Generate AI Insights'}
                  </div>
                </Button>
              )}
            </div>
            
          </div>
        </div>

        <SurveyAnalytics
          totalResponses={analytics.total}
          completedResponses={analytics.completed}
          completionRatePercent={analytics.completionRate}
          averageCompletionSeconds={analytics.avgCompletionTime}
        />

        {/* AI Insights Status */}
        {aiInsights && (
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">AI Insights Available</h3>
                  <p className="text-sm text-green-600">Click "View AI Insights" to see detailed analysis</p>
                </div>
              </div>
              {savedInsight && (
                <Badge variant="secondary" className="text-sm">
                  Saved • {new Date(savedInsight.generated_at).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </Card>
        )}

        <div className="max-w-full overflow-auto" style={{ maxHeight: '70vh' }}>
          <SurveyResponseDataTable responses={filteredResponses} questions={questions} />
        </div>
      </div>

      {/* AI Insights Modal */}
      {aiInsights && (
        <AIInsightsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          analysis={aiInsights}
          savedInsight={savedInsight}
        />
      )}
    </div>
  )
}


