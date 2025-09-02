'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  GripVertical,
  Trash2
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'

interface DraggableOptionProps {
  option: string
  index: number
  onUpdate: (value: string) => void
  onDelete: () => void
  onReorder: (fromIndex: number, toIndex: number) => void
  canDelete: boolean
}

type DragState = 'idle' | 'preview' | 'dragging'
type DropState = 'idle' | 'over'

export function DraggableOption({
  option,
  index,
  onUpdate,
  onDelete,
  onReorder,
  canDelete
}: DraggableOptionProps) {
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
        getInitialData: () => ({ type: 'option', index }),
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
          return source.data.type === 'option' && source.data.index !== index
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { type: 'option', index },
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
  }, [index, onReorder])

  const isDragging = dragState === 'dragging'
  const isDropTarget = dropState === 'over'

  return (
    <div className="relative">
      {/* Drop indicator at top */}
      {closestEdge === 'top' && (
        <DropIndicator edge="top" gap="4px" />
      )}
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`flex items-center space-x-2 transition-all ${
          isDragging ? 'opacity-50 scale-95' : ''
        } ${
          isDropTarget ? 'ring-1 ring-blue-500 ring-opacity-50 rounded' : ''
        }`}
      >
        <Button
          ref={dragHandleRef}
          variant="ghost"
          size="sm"
          className="drag-handle p-1 h-auto hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          type="button"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </Button>
        
        <Input
          value={option}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={`Option ${index + 1}`}
          className="flex-1"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={!canDelete}
          type="button"
          className={`${!canDelete ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-600'}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </motion.div>
      
      {/* Drop indicator at bottom */}
      {closestEdge === 'bottom' && (
        <DropIndicator edge="bottom" gap="4px" />
      )}
    </div>
  )
}
