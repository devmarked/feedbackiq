'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2,
  Star,
  Type,
  CheckSquare,
  Circle,
  Calendar,
  FileText,
  ToggleLeft
} from 'lucide-react'
import { SurveyQuestion } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { DraggableOption } from './DraggableOption'
import { DragDropContainer } from './DragDropContainer'

interface QuestionEditorProps {
  question: SurveyQuestion
  onUpdate: (updates: Partial<SurveyQuestion>) => void
  onDelete: () => void
}

const questionTypes = [
  { type: 'text', label: 'Text', icon: Type, description: 'Short text input' },
  { type: 'textarea', label: 'Long Text', icon: FileText, description: 'Multi-line text input' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: Circle, description: 'Single selection' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multiple selections' },
  { type: 'rating', label: 'Rating Scale', icon: Star, description: 'Numeric rating' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' }
]

export function QuestionEditor({ question, onUpdate, onDelete }: QuestionEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addOption = () => {
    const currentOptions = question.options || []
    onUpdate({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    })
  }

  const updateOption = (index: number, value: string) => {
    const currentOptions = question.options || []
    const newOptions = [...currentOptions]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const deleteOption = (index: number) => {
    const currentOptions = question.options || []
    const newOptions = currentOptions.filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  const moveOption = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    
    const currentOptions = question.options || []
    const newOptions = [...currentOptions]
    const [movedOption] = newOptions.splice(fromIndex, 1)
    newOptions.splice(toIndex, 0, movedOption)
    onUpdate({ options: newOptions })
  }

  const renderQuestionTypeSelector = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Question Type
      </label>
      <div className="grid grid-cols-2 gap-2">
        {questionTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant={question.type === type ? 'default' : 'outline'}
            size="sm"
            className="justify-start h-auto p-3"
            onClick={() => {
              onUpdate({ 
                type: type as SurveyQuestion['type'],
                // Reset options for non-choice questions
                options: ['multiple_choice', 'checkbox'].includes(type) 
                  ? question.options || ['Option 1', 'Option 2']
                  : undefined
              })
            }}
          >
            <Icon className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">{label}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )

  const renderOptionsEditor = () => {
    if (!['multiple_choice', 'checkbox'].includes(question.type)) {
      return null
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {(question.options || []).map((option, index) => (
              <DraggableOption
                key={index}
                option={option}
                index={index}
                onUpdate={(value) => updateOption(index, value)}
                onDelete={() => deleteOption(index)}
                onReorder={moveOption}
                canDelete={(question.options?.length || 0) > 1}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const renderRatingSettings = () => {
    if (question.type !== 'rating') return null

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Rating Scale
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={question.scale === 5 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ scale: 5 })}
          >
            1-5 Scale
          </Button>
          <Button
            variant={question.scale === 10 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ scale: 10 })}
          >
            1-10 Scale
          </Button>
        </div>
        {question.scale && (
          <div className="text-sm text-gray-500">
            Scale: 1 to {question.scale}
          </div>
        )}
      </div>
    )
  }

  return (
    <DragDropContainer>
      <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Question Settings</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Type */}
        {renderQuestionTypeSelector()}

        {/* Question Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Question Title *
          </label>
          <Input
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter your question..."
          />
        </div>

        {/* Question Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <Textarea
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add additional context..."
            rows={2}
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Required
            </label>
            <p className="text-xs text-gray-500">
              Users must answer this question
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate({ required: !question.required })}
            className={question.required ? 'text-blue-600' : 'text-gray-400'}
          >
            <ToggleLeft className={`w-8 h-8 ${question.required ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Type-specific Settings */}
        {renderOptionsEditor()}
        {renderRatingSettings()}

        {/* Question Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 mb-1">
                {question.title || 'Question title'}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h4>
              {question.description && (
                <p className="text-sm text-gray-600">{question.description}</p>
              )}
            </div>

            {/* Render preview based on question type */}
            {question.type === 'text' && (
              <Input placeholder="Text input" disabled />
            )}
            
            {question.type === 'textarea' && (
              <Textarea placeholder="Long text input" rows={3} disabled />
            )}
            
            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {(question.options || ['Option 1', 'Option 2']).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="radio" disabled className="text-blue-600" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {(question.options || ['Option 1', 'Option 2']).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="checkbox" disabled className="text-blue-600" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'rating' && (
              <div className="flex items-center space-x-2">
                {Array.from({ length: question.scale || 5 }, (_, i) => (
                  <Star key={i} className="w-6 h-6 text-gray-300" />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  1 - {question.scale || 5}
                </span>
              </div>
            )}
            
            {question.type === 'date' && (
              <Input type="date" disabled />
            )}
          </div>
        </div>
      </CardContent>
      </Card>
    </DragDropContainer>
  )
}
