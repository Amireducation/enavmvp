'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader2, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  createdAt?: string
}

interface ChatbotProps {
  sessionId?: string
  onSessionChange?: (sessionId: string) => void
}

export function Chatbot({ sessionId, onSessionChange }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(sessionId)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentSessionId) {
      // Fetch existing messages
      fetch(`/api/chat/sessions/${currentSessionId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []))
        .catch((err) => console.error('Failed to fetch messages:', err))
    }
  }, [currentSessionId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // If no session, create one
      let sessionToUse = currentSessionId
      if (!sessionToUse) {
        const sessionRes = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: 'general' }),
        })
        const sessionData = await sessionRes.json()
        sessionToUse = sessionData.session.id
        setCurrentSessionId(sessionToUse)
        onSessionChange?.(sessionToUse)
      }

      // Send message
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionToUse,
          message: input,
          conversationHistory: messages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Message error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col bg-background border border-muted">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Bot className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-medium">Start a conversation</p>
              <p className="text-sm text-muted-foreground">Ask about government services or how to apply</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <Bot className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="bg-muted px-4 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about services..."
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          size="icon"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  )
}
