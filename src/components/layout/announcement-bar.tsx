'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-1">
        <div className="flex items-center justify-center">
          <Link 
            href="https://www.youtube.com/watch?v=fkguwrMaDrM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity font-medium"
          >
            <span>Watch Demo</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
