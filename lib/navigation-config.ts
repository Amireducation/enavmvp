// Navigation configuration for all user roles and portals
export const navigationConfig = {
  citizen: [
    { label: 'Dashboard', href: '/citizen', icon: 'LayoutGrid' },
    { label: 'Services', href: '/citizen/services', icon: 'Briefcase' },
    { label: 'My Applications', href: '/citizen/applications', icon: 'FileText' },
    { label: 'My Profile', href: '/citizen/profile', icon: 'User' },
    { label: 'Help & Support', href: '/citizen/support', icon: 'HelpCircle' },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee', icon: 'LayoutGrid' },
    { label: 'Applications', href: '/employee/applications', icon: 'FileText' },
    { label: 'Services', href: '/employee/services', icon: 'Briefcase' },
    { label: 'Team', href: '/employee/team', icon: 'Users' },
    { label: 'Reports', href: '/employee/reports', icon: 'BarChart3' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutGrid' },
    { label: 'Services', href: '/admin/services', icon: 'Briefcase' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
  partner: [
    { label: 'Dashboard', href: '/partner', icon: 'LayoutGrid' },
    { label: 'Businesses', href: '/partner/businesses', icon: 'Building2' },
    { label: 'Services', href: '/partner/services', icon: 'Briefcase' },
    { label: 'Analytics', href: '/partner/analytics', icon: 'BarChart3' },
  ],
}

export const getRoleNavigation = (role?: string) => {
  if (!role) return navigationConfig.citizen
  return navigationConfig[role as keyof typeof navigationConfig] || navigationConfig.citizen
}
