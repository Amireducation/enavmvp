"use client"

import { Card } from "@/components/ui/card"
import { MessageCircle, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ChatbotMessageProps {
  content: string
  type: "user" | "bot"
  timestamp: Date
  language?: string
}

export function ChatbotMessage({ content, type, timestamp, language }: ChatbotMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-sm lg:max-w-md px-4 py-3 ${
          type === "user" ? "bg-amber-500 text-slate-900" : "bg-slate-800 border-slate-700 text-white"
        }`}
      >
        <div className="flex items-start gap-3">
          {type === "bot" && <MessageCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{content}</p>
            <div className="flex items-center justify-between mt-2 gap-2">
              <p className={`text-xs ${type === "user" ? "text-amber-900" : "text-slate-400"}`}>
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {type === "bot" && (
                <button onClick={handleCopy} className="hover:opacity-70 transition" title="Copy message">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                </button>
              )}
            </div>
            {language && type === "bot" && (
              <p className="text-xs text-slate-500 mt-1">Language: {language.toUpperCase()}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
