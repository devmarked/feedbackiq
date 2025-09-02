'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus
} from 'lucide-react'
import { Survey } from '@/types'
import { useBusiness } from '@/contexts/BusinessContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function SurveyOverview() {
  const { business } = useBusiness()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  
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
        .limit(5)

      if (error) throw error

      setSurveys(surveysData || [])
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Surveys</CardTitle>
        <Link href="/business/surveys">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first survey to start collecting valuable feedback from your customers.
            </p>
            <Link href="/business/surveys/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Survey
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{survey.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        {formatDate(survey.created_at)}
                      </span>
                      <span className="flex items-center">
                        {survey.response_count} responses
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className={getStatusColor(survey.status)}>
                    {survey.status}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {survey.status === 'active' && survey.share_url && (
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      More
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
