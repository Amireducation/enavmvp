'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { Chatbot } from '@/components/chatbot'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, History } from 'lucide-react'
import Link from 'next/link'

function ChatPageContent() {
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string>()

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Ethiopian Navigator Assistant</h1>
          <p className="text-muted-foreground">Get help finding and applying for government services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat */}
          <div className="lg:col-span-3">
            <Chatbot sessionId={sessionId} onSessionChange={setSessionId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <Button onClick={() => setSessionId(undefined)} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ask about specific services you need</li>
                <li>• Get help with application requirements</li>
                <li>• Learn about processing times</li>
                <li>• Find eligibility criteria</li>
                <li>• Ask in Amharic or Oromo</li>
              </ul>
            </Card>

            <Card className="p-4 bg-primary/10 border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Browse our knowledge base for detailed information.
              </p>
              <Link href="/knowledge">
                <Button variant="outline" size="sm" className="w-full">
                  View Knowledge Base
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  )
}
