'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SparklesText } from '@/components/magicui/sparkles-text'

import { 
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus
} from 'lucide-react'
import { SurveyQuestion, Survey, SurveyTemplate } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { QuestionEditor } from './QuestionEditor'
import { SurveyPreview } from './SurveyPreview'
import { TemplateSelector } from './TemplateSelector'
import { DraggableQuestion } from './DraggableQuestion'
import { DragDropContainer } from './DragDropContainer'

interface SurveyBuilderProps {
  businessId: string
  surveyId?: string
}

export function SurveyBuilder({ businessId, surveyId }: SurveyBuilderProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [survey, setSurvey] = useState<Partial<Survey>>({
    title: '',
    description: '',
    business_id: businessId,
    survey_data: { questions: [], settings: {} },
    settings: {},
    status: 'draft',
    target_audience: '',
    purpose: ''
  })
  
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplates, setShowTemplates] = useState(!surveyId)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  
  useEffect(() => {
    if (surveyId) {
      loadSurvey()
    }
  }, [surveyId])

  const loadSurvey = async () => {
    if (!surveyId) return

    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single()

      if (error) throw error

      setSurvey({
        ...data,
        target_audience: data.target_audience || '',
        purpose: data.purpose || ''
      })
      setQuestions(data.survey_data?.questions || [])
    } catch (error) {
      console.error('Error loading survey:', error)
    }
  }

  const handleTemplateSelect = (template: SurveyTemplate) => {
    const templateQuestions = template.template_data?.questions || []
    setQuestions(templateQuestions)
    setSurvey(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      template_id: template.id,
      survey_data: {
        questions: templateQuestions,
        settings: template.template_data?.settings || {}
      }
    }))
    setShowTemplates(false)
  }

  const addQuestion = (type: SurveyQuestion['type'] = 'text') => {
    const newQuestion: SurveyQuestion = {
      id: `q${Date.now()}`,
      type,
      title: 'New Question',
      required: false,
      options: type === 'multiple_choice' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    }
    
    setQuestions(prev => [...prev, newQuestion])
    setSelectedQuestionId(newQuestion.id)
  }

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    )
  }

  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null)
    }
  }

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    
    setQuestions(prev => {
      const newQuestions = [...prev]
      const [movedQuestion] = newQuestions.splice(fromIndex, 1)
      newQuestions.splice(toIndex, 0, movedQuestion)
      return newQuestions
    })
    
    // Clear selection if the selected question was moved
    if (selectedQuestionId === questions[fromIndex]?.id) {
      setSelectedQuestionId(null)
    }
  }

  const saveSurvey = async (status: 'draft' | 'active' = 'draft') => {
    if (!survey.title?.trim()) {
      alert('Please enter a survey title')
      return
    }

    if (questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    setSaving(true)
    
    try {
      const surveyData = {
        ...survey,
        survey_data: {
          questions,
          settings: survey.survey_data?.settings || {}
        },
        status,
        target_audience: survey.target_audience || null,
        purpose: survey.purpose || null
      }

      if (surveyId) {
        // Update existing survey
        const { error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', surveyId)

        if (error) throw error
      } else {
        // Create new survey
        const { data, error } = await supabase
          .from('surveys')
          .insert([{
            ...surveyData,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single()

        if (error) throw error
        
        // Redirect to edit page for the new survey
        router.push(`/business/surveys/${data.id}/edit`)
        return
      }

      if (status === 'active') {
        alert('Survey published successfully!')
        router.push('/business/surveys')
      } else {
        alert('Survey saved as draft!')
      }
    } catch (error) {
      console.error('Error saving survey:', error)
      alert('Failed to save survey. Please try again.')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const publishSurvey = async () => {
    setPublishing(true)
    await saveSurvey('active')
  }

  if (showTemplates) {
    return (
      <TemplateSelector
        onSelectTemplate={handleTemplateSelect}
        onSkip={() => setShowTemplates(false)}
      />
    )
  }

  if (showPreview) {
    return (
      <SurveyPreview
        survey={{ ...survey, survey_data: { questions, settings: {} } } as Survey}
        onClose={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    )
  }

  return (
    <DragDropContainer>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pt-8 top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/business/surveys')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {surveyId ? 'Edit Survey' : 'Create Survey'}
                </h1>
                <p className="text-sm text-gray-500">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(true)}
                disabled={questions.length === 0}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => saveSurvey('draft')}
                disabled={saving || !survey.title?.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                size="sm"
                onClick={publishSurvey}
                disabled={publishing || questions.length === 0 || !survey.title?.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {publishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Survey Builder */}
          <div className="lg:col-span-8 space-y-6">
            {/* Survey Details */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Title *
                  </label>
                  <Input
                    value={survey.title || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter survey title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={survey.description || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this survey is about..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Section */}
            <Card className="relative overflow-hidden border-2 border-gradient-to-r from-purple-500/20 to-pink-500/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <SparklesText 
                    className="text-3xl font-semibold"
                    colors={{ first: '#9E7AFF', second: '#FE8BBB' }}
                    sparklesCount={8}
                  >
                    AI Insights
                  </SparklesText>
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help AI provide better insights by providing context about your survey
                </p>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <Input
                    value={survey.target_audience || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, target_audience: e.target.value }))}
                    placeholder="e.g., Employee, Product Tester, Customer, etc."
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <Textarea
                    value={survey.purpose || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g., To get feedback for my newly released coffee flavour"
                    rows={3}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>
                {/* Decorative sparkles */}
                <div className="absolute top-4 right-4 opacity-20">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-20">
                  <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Questions</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion('text')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion('multiple_choice')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Multiple Choice
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion('rating')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Rating
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No questions yet</div>
                    <p className="text-gray-500 mb-6">
                      Add your first question to get started
                    </p>
                    <Button onClick={() => addQuestion('text')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {questions.map((question, index) => (
                        <DraggableQuestion
                          key={question.id}
                          question={question}
                          index={index}
                          isSelected={selectedQuestionId === question.id}
                          onSelect={() => setSelectedQuestionId(question.id)}
                          onEdit={() => setSelectedQuestionId(question.id)}
                          onDelete={() => deleteQuestion(question.id)}
                          onReorder={moveQuestion}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Question Editor */}
          <div className="lg:col-span-4">
            {selectedQuestionId ? (
              <QuestionEditor
                question={questions.find(q => q.id === selectedQuestionId)!}
                onUpdate={(updates: Partial<SurveyQuestion>) => updateQuestion(selectedQuestionId, updates)}
                onDelete={() => deleteQuestion(selectedQuestionId)}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-gray-400 text-lg mb-2">
                    Select a question to edit
                  </div>
                  <p className="text-gray-500">
                    Click on a question from the left panel to customize its settings
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </DragDropContainer>
  )
}
