'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Calendar } from 'lucide-react'
import { SurveyQuestion } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface SurveyQuestionRendererProps {
  question: SurveyQuestion
  value: any
  onChange: (value: any) => void
}

export function SurveyQuestionRenderer({ question, value, onChange }: SurveyQuestionRendererProps) {
  const [localValue, setLocalValue] = useState(value || '')

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  // Handle text input changes with debouncing
  const handleTextChange = (newValue: string) => {
    setLocalValue(newValue)
    // Debounce the onChange call
    const timeoutId = setTimeout(() => {
      onChange(newValue)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'text':
        return (
          <div className="space-y-6">
            <Input
              type="text"
              value={localValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your answer here..."
              className="text-lg sm:text-xl p-4 sm:p-6 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
              autoFocus
              aria-label={question.title}
              aria-required={question.required}
            />
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-6">
            <Textarea
              value={localValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="text-lg sm:text-xl p-4 sm:p-6 border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none transition-colors"
              autoFocus
              aria-label={question.title}
              aria-required={question.required}
            />
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {(question.options || []).map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 touch-manipulation ${
                  value === option
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                }`}
                onClick={() => onChange(option)}
                role="radio"
                aria-checked={value === option}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChange(option)
                  }
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    value === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {value === option && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-medium text-gray-900">{option}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-4">
            {(question.options || []).map((option, index) => {
              const selectedOptions = Array.isArray(value) ? value : []
              const isSelected = selectedOptions.includes(option)
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const currentSelected = Array.isArray(value) ? value : []
                    const newSelected = isSelected
                      ? currentSelected.filter((item: string) => item !== option)
                      : [...currentSelected, option]
                    onChange(newSelected)
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg font-medium text-gray-900">{option}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )

      case 'rating':
        const scale = question.scale || 5
        const selectedRating = typeof value === 'number' ? value : 0
        
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3">
              {Array.from({ length: scale }, (_, index) => {
                const rating = index + 1
                const isSelected = rating <= selectedRating
                const isHovered = false // We'll add hover state if needed
                
                return (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onChange(rating)}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'text-yellow-500 bg-yellow-50'
                        : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                    }`}
                  >
                    <Star 
                      className="w-8 h-8" 
                      fill={isSelected ? 'currentColor' : 'none'}
                    />
                  </motion.button>
                )
              })}
            </div>
            
            {selectedRating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <span className="text-lg text-gray-600">
                  You rated this {selectedRating} out of {scale}
                </span>
              </motion.div>
            )}

            <div className="flex justify-between text-sm text-gray-500">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
          </div>
        )

      case 'date':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-gray-400" />
              <Input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="text-xl p-6 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                autoFocus
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500">
            Unsupported question type: {question.type}
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Question Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        
        {question.description && (
          <p className="text-xl text-gray-600 mt-4">
            {question.description}
          </p>
        )}
      </motion.div>

      {/* Question Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl"
      >
        {renderQuestionContent()}
      </motion.div>

      {/* Required Field Indicator */}
      {question.required && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500"
        >
          * This field is required
        </motion.div>
      )}
    </div>
  )
}
