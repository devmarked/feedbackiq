'use client'

import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

interface DragDropContainerProps {
  children: React.ReactNode
}

export function DragDropContainer({ children }: DragDropContainerProps) {
  useEffect(() => {
    return monitorForElements({
      onDragStart: () => {
        // Add any global drag start logic here
        document.body.style.cursor = 'grabbing'
      },
      onDrop: () => {
        // Add any global drop logic here
        document.body.style.cursor = ''
      },
    })
  }, [])

  return <div className="drag-drop-container">{children}</div>
}
