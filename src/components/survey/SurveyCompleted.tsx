'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Share2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Survey } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface SurveyCompletedProps {
  survey: Survey
}

export function SurveyCompleted({ survey }: SurveyCompletedProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: survey.title,
        text: `I just completed this survey: ${survey.title}`,
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-8 max-w-lg mx-auto px-6"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900">Thank You!</h1>
          <p className="text-xl text-gray-600">
            Your response to &ldquo;{survey.title}&rdquo; has been successfully submitted.
          </p>
        </motion.div>

        {/* Business Info */}
        {survey.businesses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <div className="flex items-center justify-center space-x-4">
              {survey.businesses.logo_url && (
                <Image 
                  src={survey.businesses.logo_url} 
                  alt={survey.businesses.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg"
                />
              )}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">{survey.businesses.name}</h3>
                <p className="text-sm text-gray-600">appreciates your feedback</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <p className="text-blue-700 text-sm">
              Your responses will help improve products and services. 
              The survey creator may reach out if follow-up is needed.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          
          <p className="text-xs text-gray-500">
            You can safely close this page now.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
