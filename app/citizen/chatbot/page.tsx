"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Loader2, Zap, Bot, User, Globe, Copy, Check, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  language?: string
}

// Mock AI responses for demo
const mockResponses: Record<string, string> = {
  "national id": `To apply for a National ID Card in Ethiopia:

**Requirements:**
1. Birth Certificate (original)
2. Two recent passport-size photos
3. Proof of residence (utility bill or kebele ID)

**Process:**
1. Visit your local Kebele office
2. Fill out the application form
3. Submit required documents
4. Pay the fee of ETB 150
5. Receive your ID within 5-7 business days

**Fee:** ETB 150

Would you like help with anything else?`,

  "birth certificate": `To obtain a Birth Certificate:

**Requirements:**
1. Hospital birth record or delivery certificate
2. Parents' national IDs
3. Marriage certificate (if applicable)

**Process:**
1. Visit the Vital Events Registration Office
2. Complete the birth registration form
3. Submit all required documents
4. Pay the processing fee of ETB 50
5. Certificate ready in 3-5 business days

**Fee:** ETB 50

Is there anything else you'd like to know?`,

  passport: `For Ethiopian Passport Application:

**Requirements:**
1. National ID Card
2. Birth Certificate
3. Four passport-size photos
4. Proof of payment

**Process:**
1. Book an appointment online at immigration.gov.et
2. Visit the Immigration office on your scheduled date
3. Submit biometric data and documents
4. Pay the fee of ETB 1,500
5. Processing takes 15-30 business days

**Fee:** ETB 1,500

Need more information about any step?`,

  "driver's license": `For Driver's License Application:

**Requirements:**
1. National ID Card
2. Medical fitness certificate
3. Driving test certificate from approved school
4. Two passport photos

**Process:**
1. Complete driving school training
2. Pass written and practical tests
3. Apply at Transport Authority office
4. Submit documents and pay fee
5. License ready in 7-10 business days

**Fee:** ETB 300

Any other questions?`,

  default: `I'd be happy to help you with Ethiopian government services! 

I can provide information about:
• **National ID Card** - Application and renewal
• **Birth Certificate** - Registration process
• **Passport** - Application requirements
• **Driver's License** - How to obtain one
• **Business License** - Registration steps
• **Marriage Certificate** - Documentation needed

What service would you like to know more about?`,
}

function detectLanguage(text: string): string {
  const amharicPattern = /[\u1200-\u137F]/
  const oromoPattern = /\b(akkam|maal|eessa|yoom)\b/i

  if (amharicPattern.test(text)) return "Amharic"
  if (oromoPattern.test(text)) return "Oromo"
  return "English"
}

function getMockResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("national id") || lowerInput.includes("id card")) {
    return mockResponses["national id"]
  }
  if (lowerInput.includes("birth") || lowerInput.includes("certificate")) {
    return mockResponses["birth certificate"]
  }
  if (lowerInput.includes("passport")) {
    return mockResponses["passport"]
  }
  if (lowerInput.includes("driver") || lowerInput.includes("license")) {
    return mockResponses["driver's license"]
  }

  return mockResponses["default"]
}

function ChatbotContent() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const detectedLang = detectLanguage(input)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
      language: detectedLang,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: getMockResponse(input),
      timestamp: new Date(),
      language: "English",
    }

    setMessages((prev) => [...prev, botMessage])
    setLoading(false)
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const suggestedQuestions = [
    "How do I apply for a national ID?",
    "What documents do I need for a birth certificate?",
    "How long does passport processing take?",
    "What is the fee for a driver's license?",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/citizen">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">AI Assistant</h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Online • Multilingual Support
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">EN | አማ | Oro</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Ask me anything about Ethiopian government services. I can help in Amharic, Oromo, or English.
            </p>

            <div className="w-full max-w-lg space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
              <div className="grid gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-3 text-left bg-muted/50 hover:bg-muted border rounded-lg transition-colors text-sm flex items-center gap-3 group"
                  >
                    <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                        : "bg-gradient-to-br from-amber-500 to-amber-700"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Card
                      className={`p-4 ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0"
                          : "bg-card"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p key={i} className="font-semibold mb-1">
                                {line.replace(/\*\*/g, "")}
                              </p>
                            )
                          }
                          if (line.startsWith("•") || line.match(/^\d+\./)) {
                            return (
                              <p key={i} className="ml-2 mb-1">
                                {line}
                              </p>
                            )
                          }
                          return line ? (
                            <p key={i} className="mb-1">
                              {line}
                            </p>
                          ) : (
                            <br key={i} />
                          )
                        })}
                      </div>
                    </Card>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.type === "bot" && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 w-full py-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about government services... (EN / አማርኛ / Afaan Oromoo)"
              className="h-12"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="lg"
              className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI-powered assistant • Supports Amharic, Oromo & English
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function ChatbotPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <ChatbotContent />
    </ProtectedRoute>
  )
}
