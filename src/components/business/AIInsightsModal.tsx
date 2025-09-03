'use client'

import { SurveyAnalysis, AIInsight } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SurveyAIInsights } from './SurveyAIInsights'
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Target, 
  Calendar, 
  User, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  X
} from 'lucide-react'

interface AIInsightsModalProps {
  isOpen: boolean
  onClose: () => void
  analysis: SurveyAnalysis
  savedInsight?: AIInsight | null
}

export function AIInsightsModal({ isOpen, onClose, analysis, savedInsight }: AIInsightsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  AI Survey Insights
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Comprehensive analysis powered by artificial intelligence
                </p>
              </div>
            </div>
            {savedInsight && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date(savedInsight.generated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Executive Summary */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Executive Summary</h3>
                  <p className="text-gray-600 text-sm">Key findings and overall assessment</p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <p className="text-gray-800 leading-relaxed text-lg font-medium">
                  {analysis.summary}
                </p>
              </div>
            </div>
          </Card>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-green-800 text-lg">Strengths</h4>
                    <p className="text-green-600 text-sm">Positive aspects identified</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{analysis.strengths.length}</div>
                <div className="text-sm text-green-700 font-medium">Key Strengths Found</div>
              </div>
            </Card>

            {/* Improvements Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-300">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-orange-800 text-lg">Improvements</h4>
                    <p className="text-orange-600 text-sm">Areas needing attention</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-2">{analysis.weaknesses.length}</div>
                <div className="text-sm text-orange-700 font-medium">Areas to Address</div>
              </div>
            </Card>

            {/* Recommendations Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-blue-800 text-lg">Recommendations</h4>
                    <p className="text-blue-600 text-sm">Actionable next steps</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{analysis.recommendations.length}</div>
                <div className="text-sm text-blue-700 font-medium">Action Items</div>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis Section */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Detailed Analysis</h3>
                  <p className="text-gray-600 text-sm">In-depth insights and recommendations</p>
                </div>
              </div>
              <SurveyAIInsights analysis={analysis} />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI • Generated in real-time</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-2 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Implement export functionality
                  console.log('Export insights:', analysis)
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Insights
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
