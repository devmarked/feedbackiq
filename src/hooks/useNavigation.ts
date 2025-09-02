import { useProfile } from '@/contexts/ProfileContext'
import { UserRoleType } from '@/types'

interface NavigationItem {
  href: string
  label: string
  icon?: string
}

export function useNavigation() {
  const { profile } = useProfile()
  
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { href: '/', label: 'Home' },
    ]
    
    if (!profile) return baseItems
    
    switch (profile.role) {
      case 'business':
        return [
          ...baseItems,
          { href: '/business/dashboard', label: 'Dashboard' },
          { href: '/business/surveys', label: 'Surveys' },
        ]
      case 'admin':
        return [
          ...baseItems,
          { href: '/admin/dashboard', label: 'Admin Panel' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/businesses', label: 'Businesses' },
          { href: '/admin/surveys', label: 'All Surveys' },
          { href: '/admin/analytics', label: 'Platform Analytics' },
        ]
      default: // redirect to business setup if no specific role
        return [
          ...baseItems,
          { href: '/business/setup', label: 'Get Started' },
        ]
    }
  }

  const getQuickActions = (): NavigationItem[] => {
    if (!profile) return []
    
    switch (profile.role) {
      case 'business':
        return [
          { href: '/business/surveys/create', label: 'Create Survey' },
          { href: '/business/templates', label: 'Browse Templates' },
          { href: '/business/analytics', label: 'View Analytics' },
        ]
      case 'admin':
        return [
          { href: '/admin/users', label: 'Manage Users' },
          { href: '/admin/surveys', label: 'Review Surveys' },
          { href: '/admin/analytics', label: 'Platform Stats' },
        ]
      default: // redirect to business setup if no specific role
        return [
          { href: '/business/setup', label: 'Get Started' },
        ]
    }
  }

  const canAccess = (requiredRole: UserRoleType | UserRoleType[]): boolean => {
    if (!profile) return false
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(profile.role)
  }

  const isBusinessOwner = (): boolean => {
    return profile?.role === 'business' && !!profile.business_id
  }

  const isAdmin = (): boolean => {
    return profile?.role === 'admin'
  }

  const getUserRoleLabel = (): string => {
    switch (profile?.role) {
      case 'admin':
        return 'Administrator'
      case 'business':
        return 'Business Owner'
      case 'user':
      default:
        return 'Business User'
    }
  }

  return { 
    getNavigationItems, 
    getQuickActions,
    canAccess,
    isBusinessOwner,
    isAdmin,
    getUserRoleLabel,
    userRole: profile?.role 
  }
}
