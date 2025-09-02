'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  FileText,
  Users,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { SurveyTemplate } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface TemplateSelectorProps {
  onSelectTemplate: (template: SurveyTemplate) => void
  onSkip: () => void
}

export function TemplateSelector({ onSelectTemplate, onSkip }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<SurveyTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const supabase = createClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  const getCategories = () => {
    const categories = Array.from(new Set(templates.map(t => t.category)))
    return ['all', ...categories]
  }

  const getQuestionCount = (template: SurveyTemplate) => {
    return template.template_data?.questions?.length || 0
  }

  const getQuestionTypes = (template: SurveyTemplate): string[] => {
    const questions = template.template_data?.questions || []
    const types = Array.from(new Set(questions.map((q: any) => q.type as string))) as string[]
    return types.slice(0, 3) // Show max 3 types
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Choose a Template</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Start with a professionally designed template or create from scratch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={onSkip}>
              Start from Scratch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {getCategories().map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Templates' : category}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or category filter
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {template.usage_count} uses
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </CardTitle>
                    {template.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {getQuestionCount(template)} questions
                        </span>
                      </div>

                      {/* Question Types Preview */}
                      <div className="flex flex-wrap gap-1">
                        {getQuestionTypes(template).map((type, index) => (
                          <Badge key={`${type}-${index}`} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                        {getQuestionTypes(template).length < (template.template_data?.questions?.length || 0) && (
                          <Badge variant="outline" className="text-xs">
                            +{(template.template_data?.questions?.length || 0) - getQuestionTypes(template).length} more
                          </Badge>
                        )}
                      </div>

                      {/* Preview Questions */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Sample Questions:
                        </h4>
                        <div className="space-y-1">
                          {(template.template_data?.questions || []).slice(0, 2).map((question: any, qIndex: number) => (
                            <div key={qIndex} className="text-xs text-gray-600 truncate">
                              • {question.title}
                            </div>
                          ))}
                          {(template.template_data?.questions?.length || 0) > 2 && (
                            <div className="text-xs text-gray-500">
                              +{(template.template_data?.questions?.length || 0) - 2} more questions
                            </div>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full group-hover:text-white transition-colors"
                        onClick={() => onSelectTemplate(template)}
                      >
                        Use This Template
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
