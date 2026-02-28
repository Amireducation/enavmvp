'use client'

import { useState, useEffect } from 'react'
import { usePWA } from '@/hooks/use-pwa'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isInstallable || isInstalled || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 text-white flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-white">Install Ethiopian Navigator</h3>
          <p className="text-sm text-amber-50 mt-1">
            Get quick access to government services on your device
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="bg-white text-amber-600 hover:bg-amber-50"
              onClick={() => {
                promptInstall()
                setDismissed(true)
              }}
            >
              Install
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-amber-600"
              onClick={() => setDismissed(true)}
            >
              Later
            </Button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white hover:text-amber-100 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
