'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  ArrowRight,
  Edit3,
  X,
  Star,
  Calendar
} from 'lucide-react'
import { Survey, SurveyQuestion } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface SurveyPreviewProps {
  survey: Survey
  onClose: () => void
  onEdit: () => void
}

export function SurveyPreview({ survey, onClose, onEdit }: SurveyPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  
  const questions = survey.survey_data?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const canProceed = () => {
    if (!currentQuestion) return false
    if (!currentQuestion.required) return true
    
    const response = responses[currentQuestion.id]
    if (!response) return false
    
    // Check for empty strings or arrays
    if (typeof response === 'string' && response.trim() === '') return false
    if (Array.isArray(response) && response.length === 0) return false
    
    return true
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const renderQuestion = (question: SurveyQuestion) => {
    const response = responses[question.id]

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={response || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="text-lg"
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={response || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer..."
            rows={4}
            className="text-lg resize-none"
          />
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  response === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleResponse(question.id, option)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    response === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {response === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, index) => {
              const selectedOptions = response || []
              const isSelected = selectedOptions.includes(option)
              
              return (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const currentSelected = response || []
                    const newSelected = isSelected
                      ? currentSelected.filter((item: string) => item !== option)
                      : [...currentSelected, option]
                    handleResponse(question.id, newSelected)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border-2 rounded ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="text-white text-xs flex items-center justify-center h-full">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )

      case 'rating':
        const scale = question.scale || 5
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: scale }, (_, i) => {
                const rating = i + 1
                const isSelected = response >= rating
                
                return (
                  <button
                    key={i}
                    onClick={() => handleResponse(question.id, rating)}
                    className={`p-2 transition-colors ${
                      isSelected ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>1</span>
              <span>{response && `${response} / ${scale}`}</span>
              <span>{scale}</span>
            </div>
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={response || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="text-lg"
          />
        )

      default:
        return (
          <div className="text-gray-500 italic">
            Question type &quot;{question.type}&quot; not implemented in preview
          </div>
        )
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No questions to preview
            </h3>
            <p className="text-gray-600 mb-6">
              Add some questions to see the survey preview
            </p>
            <Button onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Add Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Survey Preview</h1>
                <p className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Survey
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Survey Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {survey.title || 'Untitled Survey'}
            </h1>
            {survey.description && (
              <p className="text-lg text-gray-600 mb-6">
                {survey.description}
              </p>
            )}
            <Progress value={progress} className="w-full h-2" />
          </motion.div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {currentQuestion.title}
                      {currentQuestion.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h2>
                    {currentQuestion.description && (
                      <p className="text-gray-600">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>
                  
                  {renderQuestion(currentQuestion)}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {Array.from({ length: questions.length }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentQuestionIndex
                      ? 'bg-blue-500'
                      : i < currentQuestionIndex
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Survey
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Required Field Notice */}
          {currentQuestion.required && !canProceed() && (
            <div className="text-center mt-4">
              <p className="text-sm text-red-600">
                This question is required
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
