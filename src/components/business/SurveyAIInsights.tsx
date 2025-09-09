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
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-700 border-green-200'
      case 'neutral': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'negative': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
          </div>
          <div className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-800 text-sm leading-relaxed">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-800 text-sm leading-relaxed">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Themes */}
      {analysis.themes && analysis.themes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Key Themes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.themes
              .sort((a, b) => {
                // Sort by sentiment: positive → neutral → negative
                const sentimentOrder = { positive: 0, neutral: 1, negative: 2 };
                return sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment];
              })
              .map((theme, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{theme.theme}</h4>
                    <Badge className={`text-xs ${getSentimentColor(theme.sentiment)}`}>
                      {theme.sentiment}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    Mentioned {theme.frequency} time{theme.frequency !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
        </div>
        <div className="space-y-3">
          {analysis.recommendations
            .sort((a, b) => {
              // Sort by impact: high → medium → low
              const impactOrder = { high: 0, medium: 1, low: 2 };
              return impactOrder[a.impact] - impactOrder[b.impact];
            })
            .map((recommendation, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm">{recommendation.area}</h4>
                  <Badge className={`text-xs ${getImpactColor(recommendation.impact)}`}>
                    {recommendation.impact} impact
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{recommendation.suggestion}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
