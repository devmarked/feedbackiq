'use client'

import { useState, useEffect } from 'react'
import { useAppAuth } from '@/hooks/useAppAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Plus, 
  Search,
  Sparkles
} from 'lucide-react'
import { Survey } from '@/types'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { SurveyDataTable } from '@/components/business/SurveyDataTable'

export default function SurveysPage() {
  const { user, profile, business, loading } = useAppAuth({ 
    requiredRole: 'business',
    requireBusiness: true 
  })
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [surveysLoading, setSurveysLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (business?.id) {
      fetchSurveys()
    }
  }, [business?.id])

  const fetchSurveys = async () => {
    if (!business?.id) return

    try {
      const { data: surveysData, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSurveys(surveysData || [])
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      setSurveysLoading(false)
    }
  }



  if (loading || surveysLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Surveys</h1>
            <p className="text-lg text-gray-600 mt-3">
              Create, manage, and analyze your surveys
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
                    Create a survey
                  </div>
                </Button>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Surveys DataTable */}
        {surveys.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No surveys yet
              </h3>
              <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                Create your first survey to start collecting valuable feedback from your customers.
              </p>
              <Link href="/business/surveys/create">
                <Button size="lg" className="text-base px-8 py-3">
                  <Plus className="w-5 h-5 mr-3" />
                  Create Your First Survey
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <SurveyDataTable data={surveys} onSurveyDeleted={fetchSurveys} />
        )}
      </div>
    </div>
  )
}
