'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

// Custom DialogContent without close button
const DialogContentWithoutClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContentWithoutClose.displayName = DialogPrimitive.Content.displayName

interface ContactPreference {
  anonymous: boolean
  name?: string
  email?: string
}

interface ContactPreferenceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (pref: ContactPreference) => void
}

export function ContactPreferenceModal({ open, onClose, onConfirm }: ContactPreferenceModalProps) {
  const [anonymous, setAnonymous] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) {
      setAnonymous(true)
      setName('')
      setEmail('')
      setTouched(false)
    }
  }, [open])

  const emailValid = !email || /.+@.+\..+/.test(email)
  const canSubmit = anonymous || (name.trim().length > 0 && emailValid && email.trim().length > 0)

  return (
    <Dialog open={open}>
      <DialogContentWithoutClose onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Share your contact details?</DialogTitle>
          <DialogDescription className="text-base">
            You can stay anonymous, or share your name and email so the survey creator may follow up. Your responses will be stored securely. We never sell your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="flex items-center space-x-2">
            <Checkbox checked={anonymous} onCheckedChange={(v) => setAnonymous(Boolean(v))} />
            <span className="text-base">I prefer to remain anonymous</span>
          </label>

          {!anonymous && (
            <div className="space-y-3">
              <div>
                <label className="block text-base mb-1">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-base mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setTouched(true) }}
                  placeholder="you@example.com"
                />
                {!emailValid && touched && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid email.</p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            By continuing, you acknowledge: Privacy details are handled according to the survey creator's policy. If you provide an email, the survey creator may contact you for follow-up about this survey only.
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onConfirm({ anonymous, name: anonymous ? undefined : name.trim(), email: anonymous ? undefined : email.trim() })} disabled={!canSubmit}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContentWithoutClose>
    </Dialog>
  )
}

export type { ContactPreference }


