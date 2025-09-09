'use client'

import { createContext, useContext, ReactNode } from 'react'
import { toast } from 'sonner'

interface ToastContextType {
  showSuccess: (message: string, description?: string) => void
  showError: (message: string, description?: string) => void
  showInfo: (message: string, description?: string) => void
  showWarning: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
      className: 'bg-white border border-gray-200 text-black [&>div]:text-black [&_div]:text-black [&_p]:text-black',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
      },
    })
  }

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
      className: 'bg-white border border-gray-200 text-black [&>div]:text-black [&_div]:text-black [&_p]:text-black',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
      },
    })
  }

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
      className: 'bg-white border border-gray-200 text-black [&>div]:text-black [&_div]:text-black [&_p]:text-black',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
      },
    })
  }

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
      className: 'bg-white border border-gray-200 text-black [&>div]:text-black [&_div]:text-black [&_p]:text-black',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
      },
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
