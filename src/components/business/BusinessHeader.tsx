'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Settings } from 'lucide-react'
import { Business } from '@/types'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BusinessHeaderProps {
  business: Business | null
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalResponses: 0,
    avgResponseRate: 0
  })
  
  const supabase = createClient()

  useEffect(() => {
    if (business?.id) {
      fetchStats()
    }
  }, [business?.id])

  const fetchStats = async () => {
    if (!business?.id) return

    try {
      const { data: surveysData, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('business_id', business.id)

      if (error) throw error

      // Calculate stats
      const total = surveysData?.length || 0
      const active = surveysData?.filter(s => s.status === 'active').length || 0
      const totalResponses = surveysData?.reduce((sum, s) => sum + (s.response_count || 0), 0) || 0
      const avgResponseRate = total > 0 ? Math.round((totalResponses / total) * 100) / 100 : 0

      setStats({
        total,
        active,
        totalResponses,
        avgResponseRate
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'enterprise':
        return 'bg-gold-100 text-gold-800 border-gold-200'
      case 'basic':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-96 overflow-hidden rounded-lg"
    >
      {/* Cover Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/building.jpg" 
          alt="Business Dashboard Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/70 to-teal-900/70" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
        {/* Top Section - Settings Button */}
        <div className="flex justify-end">
          <Link href="/business/settings">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Middle Section - Company Details */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {business?.logo_url ? (
                <img 
                  src={business.logo_url} 
                  alt={`${business.name} logo`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {business?.name || 'Your Business'}
              </h1>
              <p className="text-lg opacity-90 mb-3">
                {business?.industry || 'Business Dashboard'} • {business?.size || 'startup'} company
              </p>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`text-sm font-medium ${getSubscriptionColor(business?.subscription_plan || 'free')}`}
                >
                  {(business?.subscription_plan || 'free').toUpperCase()} Plan
                </Badge>
                {business?.is_active && (
                  <Badge variant="secondary" className="text-sm bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Business description */}
          {business?.description && (
            <div className="max-w-md">
              <p className="text-sm opacity-90">
                {business.description}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Section - Stats Cards with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between divide-x divide-white/20">
                {/* Total Surveys */}
                <div className="flex-1 px-4 first:pl-0">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Total Surveys</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <span className="text-xs text-white/60">surveys</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-400">↗ 7.3%</span>
                  </div>
                </div>

                {/* Active */}
                <div className="flex-1 px-4">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Active</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-white">{stats.active}</p>
                    <span className="text-xs text-white/60">active</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-400">↗ 5.3%</span>
                  </div>
                </div>

                {/* Total Responses */}
                <div className="flex-1 px-4">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Total Responses</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-white">{stats.totalResponses}</p>
                    <span className="text-xs text-white/60">responses</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-400">↗ 8.1%</span>
                  </div>
                </div>

                {/* Avg Responses */}
                <div className="flex-1 px-4 last:pr-0">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Avg Responses</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-white">{stats.avgResponseRate}</p>
                    <span className="text-xs text-white/60">avg</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-400">↗ 2.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
