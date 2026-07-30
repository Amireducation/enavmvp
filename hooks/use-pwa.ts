'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Skip service worker registration in v0 preview and development environments
    const isV0Preview = typeof window !== 'undefined' && window.location.hostname.includes('vusercontent.net')
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    if (isV0Preview || isDevelopment || !('serviceWorker' in navigator)) {
      // Skip registration in v0 preview, development, or unsupported browsers
      return
    }

    // Check if service worker file exists before registering
    fetch('/service-worker.js', { method: 'HEAD' })
      .then((response) => {
        if (response.ok && !response.redirected) {
          navigator.serviceWorker.register('/service-worker.js').catch(() => {
            // Silently fail - service worker is optional
          })
        }
      })
      .catch(() => {
        // Service worker file doesn't exist, skip registration
      })

    // Check if running as PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    setIsInstalled(isStandalone)

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Handle online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    promptInstall,
  }
}
