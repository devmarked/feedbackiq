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
  BarChart3,
  CheckCircle,
  AlertTriangle,
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  AI Survey Insights
                </DialogTitle>
                <p className="text-gray-600 text-base mt-1">
                  Comprehensive analysis powered by artificial intelligence
                </p>
              </div>
            </div>
            {savedInsight && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(savedInsight.generated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Executive Summary */}
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Executive Summary</h3>
                  <p className="text-gray-600 text-sm">Key findings and overall assessment</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed text-base">
                  {analysis.summary}
                </p>
              </div>
            </div>
          </Card>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Strengths</h4>
                    <p className="text-gray-600 text-sm">Positive aspects identified</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">{analysis.strengths.length}</div>
                <div className="text-sm text-gray-600">Key Strengths Found</div>
              </div>
            </Card>

            {/* Improvements Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Improvements</h4>
                    <p className="text-gray-600 text-sm">Areas needing attention</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-1">{analysis.weaknesses.length}</div>
                <div className="text-sm text-gray-600">Areas to Address</div>
              </div>
            </Card>

            {/* Recommendations Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Recommendations</h4>
                    <p className="text-gray-600 text-sm">Actionable next steps</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{analysis.recommendations.length}</div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis Section */}
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
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
                className="px-6 py-2"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Implement export functionality
                  console.log('Export insights:', analysis)
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
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
