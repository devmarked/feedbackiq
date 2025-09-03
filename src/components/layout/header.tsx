'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigation } from '@/hooks/useNavigation'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  const { getNavigationItems, getUserRoleLabel, userRole } = useNavigation()

  const navigationItems = getNavigationItems()

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="h-8 flex items-center justify-center">
              <Image 
                src="/images/logo.svg" 
                alt="FeedbackIQ Logo" 
                width={120} 
                height={32}
                className="h-full w-auto antialiased"
                style={{
                  imageRendering: 'crisp-edges',
                  shapeRendering: 'geometricPrecision'
                }}
                unoptimized
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-9 bg-gray-300 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {userRole && (
                  <Badge variant="secondary" className="text-xs">
                    {getUserRoleLabel()}
                  </Badge>
                )}
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
