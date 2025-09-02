'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Globe, Users, Briefcase, ArrowRight, Check } from 'lucide-react'
import { BusinessRegistrationData, BusinessSize } from '@/types'
import { useBusiness } from '@/contexts/BusinessContext'
import { useProfile } from '@/contexts/ProfileContext'

const businessSizes: { value: BusinessSize; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'startup',
    label: 'Startup',
    description: '1-10 employees',
    icon: <Users className="w-4 h-4" />
  },
  {
    value: 'small',
    label: 'Small Business',
    description: '11-50 employees',
    icon: <Building2 className="w-4 h-4" />
  },
  {
    value: 'medium',
    label: 'Medium Business',
    description: '51-200 employees',
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    value: 'large',
    label: 'Large Business',
    description: '201-1000 employees',
    icon: <Building2 className="w-4 h-4" />
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: '1000+ employees',
    icon: <Building2 className="w-4 h-4" />
  }
]

const commonIndustries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Food & Beverage',
  'Real Estate',
  'Transportation',
  'Entertainment',
  'Consulting',
  'Non-Profit',
  'Other'
]

export function BusinessRegistrationForm() {
  const [formData, setFormData] = useState<BusinessRegistrationData>({
    businessName: '',
    description: '',
    website: '',
    industry: '',
    size: 'startup'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  
  const { createBusiness } = useBusiness()
  const { refreshProfile } = useProfile()
  const router = useRouter()

  const handleInputChange = (field: keyof BusinessRegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.businessName.trim()) {
      setError('Business name is required')
      return false
    }
    if (formData.businessName.trim().length < 2) {
      setError('Business name must be at least 2 characters long')
      return false
    }
    return true
  }

  const validateWebsite = (website: string) => {
    if (!website) return true // Optional field
    const urlPattern = /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/
    return urlPattern.test(website)
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep1()) return
    
    if (formData.website && !validateWebsite(formData.website)) {
      setError('Please enter a valid website URL (e.g., https://example.com)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: createError, business } = await createBusiness(formData)

      if (createError) {
        setError(createError.message || 'Failed to create business')
        return
      }

      // Refresh profile to update business_id
      await refreshProfile()
      
      // Redirect to business dashboard
      router.push('/business/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Business registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Let&apos;s start with the basics</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <Input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="Enter your business name"
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your business (optional)"
            className="w-full"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button 
        onClick={handleNext}
        className="w-full"
        size="lg"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
        <p className="text-gray-600">Help us understand your business better</p>
      </div>

      <div className="space-y-6">
        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Industry
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonIndustries.map((industry) => (
              <button
                key={industry}
                type="button"
                onClick={() => handleInputChange('industry', industry)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  formData.industry === industry
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <Input
              type="text"
              value={formData.industry && !commonIndustries.includes(formData.industry) ? formData.industry : ''}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="Or enter custom industry"
              className="w-full"
            />
          </div>
        </div>

        {/* Business Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Size *
          </label>
          <div className="space-y-2">
            {businessSizes.map((size) => (
              <Card
                key={size.value}
                className={`cursor-pointer transition-all ${
                  formData.size === size.value
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('size', size.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {size.icon}
                      <div>
                        <h3 className="font-medium text-gray-900">{size.label}</h3>
                        <p className="text-sm text-gray-500">{size.description}</p>
                      </div>
                    </div>
                    {formData.size === size.value && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <Button 
          onClick={handleBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Business...
            </div>
          ) : (
            <>
              Create Business
              <Check className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Register Your Business</CardTitle>
          <CardDescription className="text-lg">
            Join thousands of businesses using our survey platform
          </CardDescription>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 rounded-full ${
              step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </CardContent>
      </Card>
    </div>
  )
}
