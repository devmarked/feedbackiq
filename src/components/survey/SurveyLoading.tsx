'use client'

import { motion } from 'framer-motion'

export function SurveyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Loading Survey</h2>
          <p className="text-gray-600">Please wait while we prepare your survey...</p>
        </div>
      </motion.div>
    </div>
  )
}
