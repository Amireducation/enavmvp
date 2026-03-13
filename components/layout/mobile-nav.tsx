'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'For Citizens', href: '/citizen' },
  { label: 'For Businesses', href: '/partner' },
  { label: 'For Government', href: '/g2g' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-foreground"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border">
          <nav className="flex flex-col p-4 gap-2">
            {MOBILE_NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="text-left px-4 py-2 rounded-md hover:bg-accent text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleNavigation('/auth/login')}
              >
                Log In
              </Button>
              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={() => handleNavigation('/auth/register')}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
