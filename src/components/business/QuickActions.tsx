'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function QuickActions() {
  const actions = [
    {
      title: 'Create Survey',
      description: 'Build a new survey from scratch or use a template',
      icon: Plus,
      href: '/business/surveys/create',
      color: 'bg-blue-500 hover:bg-blue-600',
      primary: true
    },
    {
      title: 'Browse Templates',
      description: 'Start with pre-built survey templates',
      icon: FileText,
      href: '/business/templates',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Analyze your survey performance',
      icon: BarChart3,
      href: '/business/analytics',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Manage Team',
      description: 'Invite team members and manage access',
      icon: Users,
      href: '/business/team',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  const quickStats = [
    { label: 'This Week', value: '0', subtext: 'New responses' },
    { label: 'This Month', value: '0', subtext: 'Survey views' },
    { label: 'Response Rate', value: '0%', subtext: 'Average completion' }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <Button
                  variant={action.primary ? "default" : "outline"}
                  className={`w-full justify-start h-auto p-4 ${
                    action.primary ? action.color : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center w-full">
                    <div className={`p-2 rounded-lg mr-3 ${
                      action.primary 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      <action.icon className={`w-4 h-4 ${
                        action.primary ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${
                        action.primary ? 'text-white' : 'text-gray-900'
                      }`}>
                        {action.title}
                      </div>
                      <div className={`text-xs ${
                        action.primary ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {action.description}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${
                      action.primary ? 'text-white/80' : 'text-gray-400'
                    }`} />
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.subtext}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/business/analytics">
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Settings Shortcut */}
      <Card>
        <CardContent className="p-4">
          <Link href="/business/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Business Settings
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
