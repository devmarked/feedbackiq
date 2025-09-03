import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { BusinessProvider } from '@/contexts/BusinessContext'
import { AppInitializer } from '@/components/AppInitializer'
import { ConditionalLayout } from '@/components/ConditionalLayout'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'feedbackIQ - Smart Survey Platform for Business Insights',
  description: 'Create, share, and analyze surveys with AI-powered insights. Transform feedback into actionable business intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <ProfileProvider>
            <BusinessProvider>
              <AppInitializer>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </AppInitializer>
            </BusinessProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
