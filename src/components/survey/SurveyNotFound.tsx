'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SurveyNotFoundProps {
  error?: string | null
}

export function SurveyNotFound({ error }: SurveyNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 max-w-md mx-auto px-6"
      >
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        {/* Error Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Survey Not Found</h1>
          <p className="text-lg text-gray-600">
            {error || "Sorry, we couldn't find the survey you're looking for. It may have been removed, expired, or the link might be incorrect."}
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">This might have happened because:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The survey has been closed or archived
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The survey link is incorrect or incomplete
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The survey has reached its response limit
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact the survey creator.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
