'use client'

import { SurveyAnalysis } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react'

interface SurveyAIInsightsProps {
  analysis: SurveyAnalysis
}

export function SurveyAIInsights({ analysis }: SurveyAIInsightsProps) {
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200'
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'negative': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Analysis Summary</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Themes */}
      {analysis.themes && analysis.themes.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Key Themes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.themes.map((theme, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{theme.theme}</h4>
                  <Badge className={getSentimentColor(theme.sentiment)}>
                    {theme.sentiment}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Mentioned {theme.frequency} time{theme.frequency !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Recommendations</h3>
        </div>
        <div className="space-y-4">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{recommendation.area}</h4>
                <Badge className={getImpactColor(recommendation.impact)}>
                  {recommendation.impact} impact
                </Badge>
              </div>
              <p className="text-gray-700">{recommendation.suggestion}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
