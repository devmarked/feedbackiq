'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  Activity
} from 'lucide-react'
import { useBusiness } from '@/contexts/BusinessContext'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface ActivityItem {
  id: string
  type: 'survey_created' | 'response_received' | 'survey_published' | 'survey_completed'
  title: string
  description: string
  timestamp: string
  icon: any
  color: string
  metadata?: any
}

export function RecentActivity() {
  const { business } = useBusiness()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (business?.id) {
      fetchRecentActivity()
    }
  }, [business?.id])

  const fetchRecentActivity = async () => {
    if (!business?.id) return

    try {
      // For now, we'll create mock data based on actual surveys
      // In a real implementation, you'd have an activities/audit log table
      
      const { data: surveys, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      const mockActivities: ActivityItem[] = []

      // Generate activities from surveys
      surveys?.forEach((survey) => {
        // Survey creation activity
        mockActivities.push({
          id: `survey_created_${survey.id}`,
          type: 'survey_created',
          title: 'Survey Created',
          description: `"${survey.title}" was created`,
          timestamp: survey.created_at,
          icon: FileText,
          color: 'text-blue-600'
        })

        // Survey published activity (if active)
        if (survey.status === 'active') {
          mockActivities.push({
            id: `survey_published_${survey.id}`,
            type: 'survey_published',
            title: 'Survey Published',
            description: `"${survey.title}" is now live and collecting responses`,
            timestamp: survey.updated_at,
            icon: TrendingUp,
            color: 'text-green-600'
          })
        }

        // Mock response activities
        if (survey.response_count > 0) {
          mockActivities.push({
            id: `responses_${survey.id}`,
            type: 'response_received',
            title: 'New Responses',
            description: `Received ${survey.response_count} responses for "${survey.title}"`,
            timestamp: survey.updated_at,
            icon: MessageSquare,
            color: 'text-purple-600'
          })
        }
      })

      // Sort by timestamp and take most recent
      const sortedActivities = mockActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)

      setActivities(sortedActivities)
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'survey_created':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Created</Badge>
      case 'survey_published':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>
      case 'response_received':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Response</Badge>
      case 'survey_completed':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Completed</Badge>
      default:
        return <Badge variant="secondary">Activity</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2 text-orange-500" />
          Recent Activity
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Last 7 days
        </Badge>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-500">
              Activity will appear here as you create surveys and receive responses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-gray-100`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getActivityBadge(activity.type)}
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {activities.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent activity to show</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
