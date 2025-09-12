'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/header'
import FooterWrapper from '@/components/layout/footerWrapper'
import AnnouncementBar from '@/components/layout/announcement-bar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're on a survey page
  const isSurveyPage = pathname?.startsWith('/survey/')
  
  if (isSurveyPage) {
    // For survey pages, render only the children without header/footer
    return <>{children}</>
  }
  
  // For all other pages, render with header and footer
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <FooterWrapper />
    </>
  )
}
