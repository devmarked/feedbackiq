"use client"

import * as React from "react"
import { useState, useRef } from "react"
import QRCode from "react-qrcode-logo"
import { X, Copy, Mail, Facebook, Twitter, ExternalLink, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Survey } from "@/types"

interface ShareSurveyModalProps {
  survey: Survey
  isOpen: boolean
  onClose: () => void
}

export function ShareSurveyModal({ survey, isOpen, onClose }: ShareSurveyModalProps) {
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const qrRef = useRef<any>(null)
  
  // Generate the survey URL - this will redirect to /survey/{id}
  const surveyUrl = `${window.location.origin}/survey/${survey.id}`
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(surveyUrl)
    const encodedTitle = encodeURIComponent(survey.title)
    const encodedDescription = encodeURIComponent(survey.description || '')
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleDownloadQR = async () => {
    setIsDownloading(true)
    try {
      // Find the hidden high-resolution QR code canvas
      const hiddenQR = document.querySelector('div[style*="-9999px"] canvas')
      
      if (hiddenQR) {
        // Get the canvas data URL
        const canvas = hiddenQR as HTMLCanvasElement
        const dataURL = canvas.toDataURL('image/png')
        
        // Create download link
        const link = document.createElement('a')
        link.download = `survey-qr-${survey.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
        link.href = dataURL
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Fallback: use the visible QR code
        if (qrRef.current && qrRef.current.download) {
          const filename = `survey-qr-${survey.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
          qrRef.current.download(filename)
        }
      }
      
    } catch (error) {
      console.error('Error downloading QR code:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            Share Survey
          </DialogTitle>
          <DialogDescription className="text-base">
            Share &ldquo;{survey.title}&rdquo; with your audience using the QR code or direct link below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
              <QRCode
                ref={qrRef}
                value={surveyUrl}
                size={180}
                logoImage="/images/dobby.png"
                logoWidth={35}
                logoHeight={35}
                logoOpacity={0.9}
                qrStyle="squares"
                eyeRadius={8}
                eyeColor="#3b82f6"
                fgColor="#1f2937"
                bgColor="#ffffff"
                enableCORS={true}
              />
            </div>
            
            {/* Hidden high-resolution QR code for download */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <QRCode
                value={surveyUrl}
                size={720}
                logoImage="/images/dobby.png"
                logoWidth={144}
                logoHeight={144}
                logoOpacity={0.9}
                qrStyle="squares"
                eyeRadius={32}
                eyeColor="#3b82f6"
                fgColor="#1f2937"
                bgColor="#ffffff"
                enableCORS={true}
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Scan this QR code to access the survey on mobile devices
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                disabled={isDownloading}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Survey Link Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">
              Survey Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={surveyUrl}
                readOnly
                className="flex-1 text-sm bg-gray-50 border-gray-200"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="px-4 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 font-medium">✓ Link copied to clipboard!</p>
            )}
          </div>

          {/* Social Sharing Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">
              Share on Social Media
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Twitter className="h-4 w-4 mb-1 text-blue-500" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Facebook className="h-4 w-4 mb-1 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare('email')}
                className="flex flex-col items-center py-3 hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-4 w-4 mb-1 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Survey Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">{survey.title}</h4>
            {survey.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{survey.description}</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  survey.status === 'active' ? 'bg-green-100 text-green-800' :
                  survey.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  survey.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {survey.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Responses:</span>
                <span className="font-semibold text-gray-900">{survey.response_count}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
