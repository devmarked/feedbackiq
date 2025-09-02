'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GripVertical,
  Settings,
  Trash2
} from 'lucide-react'
import { SurveyQuestion } from '@/types'
import { motion } from 'framer-motion'
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'

interface DraggableQuestionProps {
  question: SurveyQuestion
  index: number
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

type DragState = 'idle' | 'preview' | 'dragging'
type DropState = 'idle' | 'over'

export function DraggableQuestion({
  question,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onReorder
}: DraggableQuestionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [dragState, setDragState] = useState<DragState>('idle')
  const [dropState, setDropState] = useState<DropState>('idle')
  const [closestEdge, setClosestEdge] = useState<'top' | 'bottom' | null>(null)

  useEffect(() => {
    const element = ref.current
    const dragHandle = dragHandleRef.current
    
    if (!element || !dragHandle) return

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => ({ type: 'question', index, questionId: question.id }),
        onGenerateDragPreview: () => {
          setDragState('preview')
        },
        onDragStart: () => {
          setDragState('dragging')
        },
        onDrop: () => {
          setDragState('idle')
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.type === 'question' && source.data.index !== index
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { type: 'question', index },
            {
              element,
              input,
              allowedEdges: ['top', 'bottom'],
            }
          )
        },
        onDragEnter: ({ self }) => {
          setDropState('over')
          const edge = extractClosestEdge(self.data)
          setClosestEdge(edge === 'top' || edge === 'bottom' ? edge : null)
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          setClosestEdge(edge === 'top' || edge === 'bottom' ? edge : null)
        },
        onDragLeave: () => {
          setDropState('idle')
          setClosestEdge(null)
        },
        onDrop: ({ self, source }) => {
          setDropState('idle')
          setClosestEdge(null)
          
          const sourceIndex = source.data.index as number
          const targetIndex = index
          const edge = extractClosestEdge(self.data)
          
          if (sourceIndex === targetIndex) return
          
          let newIndex = targetIndex
          if (edge === 'bottom') {
            newIndex = targetIndex + 1
          }
          
          // Adjust for the source being removed
          if (sourceIndex < newIndex) {
            newIndex--
          }
          
          onReorder(sourceIndex, newIndex)
        },
      })
    )
  }, [index, question.id, onReorder])

  const isDragging = dragState === 'dragging'
  const isDropTarget = dropState === 'over'

  return (
    <div className="relative">
      {/* Drop indicator at top */}
      {closestEdge === 'top' && (
        <DropIndicator edge="top" gap="8px" />
      )}
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        } ${
          isDragging ? 'opacity-50 scale-95' : ''
        } ${
          isDropTarget ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Button
              ref={dragHandleRef}
              variant="ghost"
              size="sm"
              className="drag-handle p-1 h-auto hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {index + 1}
                </span>
                <Badge variant="secondary">
                  {question.type.replace('_', ' ')}
                </Badge>
                {question.required && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {question.title}
              </h4>
              {question.description && (
                <p className="text-sm text-gray-600">
                  {question.description}
                </p>
              )}
              
              {/* Show options preview for choice questions */}
              {(question.type === 'multiple_choice' || question.type === 'checkbox') && question.options && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {question.options.slice(0, 3).map((option, optIndex) => (
                      <span key={optIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {option}
                      </span>
                    ))}
                    {question.options.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{question.options.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Show scale for rating questions */}
              {question.type === 'rating' && question.scale && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Rating scale: 1-{question.scale}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Drop indicator at bottom */}
      {closestEdge === 'bottom' && (
        <DropIndicator edge="bottom" gap="8px" />
      )}
    </div>
  )
}
