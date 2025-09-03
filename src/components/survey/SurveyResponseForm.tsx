'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Survey, SurveyQuestion } from '@/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SurveyQuestionRenderer } from './SurveyQuestionRenderer'
import { supabase } from '@/lib/supabase'
import { ContactPreferenceModal } from './ContactPreferenceModal'
import type { ContactPreference } from './ContactPreferenceModal'
import Image from 'next/image'

interface SurveyResponseFormProps {
  survey: Survey
  onComplete: () => void
}

interface ResponseData {
  [questionId: string]: any
}

export function SurveyResponseForm({ survey, onComplete }: SurveyResponseFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<ResponseData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [startTime] = useState(Date.now())
  const [contactModalOpen, setContactModalOpen] = useState(true)
  const [contactPref, setContactPref] = useState<ContactPreference | null>(null)

  // Helper function to get business data safely
  const getBusiness = () => {
    if (!survey.businesses) return null
    return Array.isArray(survey.businesses) ? survey.businesses[0] : survey.businesses
  }

  const business = getBusiness()

  // Parse questions from survey data
  const questions: SurveyQuestion[] = survey.survey_data?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Handle response updates
  const handleResponseChange = useCallback((questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }, [])

  // Navigation functions
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [currentQuestionIndex, questions.length])

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        if (canProceed()) {
          if (isLastQuestion) {
            handleSubmit()
          } else {
            goToNextQuestion()
          }
        }
      } else if (event.key === 'ArrowUp' || (event.key === 'ArrowLeft' && event.metaKey)) {
        event.preventDefault()
        goToPreviousQuestion()
      } else if (event.key === 'ArrowDown' || (event.key === 'ArrowRight' && event.metaKey)) {
        event.preventDefault()
        if (canProceed()) {
          goToNextQuestion()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestionIndex, responses, isLastQuestion])

  // Check if user can proceed to next question
  const canProceed = useCallback(() => {
    if (!currentQuestion) return false
    
    const response = responses[currentQuestion.id]
    
    // If question is required, check if there's a response
    if (currentQuestion.required) {
      if (response === undefined || response === null || response === '') {
        return false
      }
      
      // For checkbox questions, ensure at least one option is selected
      if (currentQuestion.type === 'checkbox' && Array.isArray(response) && response.length === 0) {
        return false
      }
    }
    
    return true
  }, [currentQuestion, responses])

  // Submit survey response
  const doSubmit = async (finalContactPref: ContactPreference | null) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const completionTime = Math.round((Date.now() - startTime) / 1000) // in seconds
      
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: survey.id,
          response_data: responses,
          completion_time: completionTime,
          is_complete: true,
          metadata: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            questions_answered: Object.keys(responses).length,
            total_questions: questions.length,
            contact_preference: finalContactPref ?? contactPref ?? { anonymous: true }
          }
        })

      if (error) {
        console.error('Error submitting response:', error)
        throw new Error('Failed to submit your response. Please try again.')
      }

      // Update survey response count
      const { error: countError } = await supabase.rpc('increment_survey_response_count', {
        survey_id: survey.id
      })

      if (countError) {
        console.error('Error updating response count:', countError)
        // Don't throw here as the response was saved successfully
      }

      onComplete()
    } catch (error) {
      console.error('Failed to submit survey:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!contactPref) {
      setContactModalOpen(true)
      return
    }
    await doSubmit(contactPref)
  }

  const handleConfirmContact = async (pref: ContactPreference) => {
    setContactPref(pref)
    setContactModalOpen(false)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600">This survey doesn&apos;t have any questions yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ContactPreferenceModal
        open={contactModalOpen}
        onClose={() => { /* disabled close - modal must respond */ }}
        onConfirm={handleConfirmContact}
      />
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
          <Progress value={progress} className="h-1.5 sm:h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 sm:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[60vh] flex flex-col justify-center"
            >
              {/* Survey Header - Only show on first question */}
              {currentQuestionIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="flex items-center mb-4">
                    {business?.logo_url && (
                      <Image 
                        src={business.logo_url} 
                        alt={business.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
                      {survey.description && (
                        <p className="text-lg text-gray-600 mt-2">{survey.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Question */}
              <div className="flex-1">
                <SurveyQuestionRenderer
                  question={currentQuestion}
                  value={responses[currentQuestion.id]}
                  onChange={(value: any) => handleResponseChange(currentQuestion.id, value)}
                />
                
                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-red-500 mr-3">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
              <span>to continue</span>
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                disabled={!canProceed()}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
