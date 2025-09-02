import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { BusinessProvider } from '@/contexts/BusinessContext'
import { AppInitializer } from '@/components/AppInitializer'
import { ConditionalLayout } from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  title: 'DobbyHub - World\'s First Loyal and Most Free LLMs',
  description: 'Chat with Dobby and explore community-built AI apps. World\'s First Loyal and Most Free LLMs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
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
