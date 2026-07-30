'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Bot, User, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  eligibility?: {
    eligible: boolean;
    reason: string;
  };
  createdAt?: string;
}

export function EnhancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Ethiopian Navigator AI Assistant. I can help you find and apply for government services. What service are you looking for today?',
      suggestions: ['View all services', 'Check eligibility', 'Track my application', 'Get help with documents']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        suggestions: data.suggestions,
        eligibility: data.eligibility,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update context with user info if provided
      if (data.context) {
        setContext((prev: any) => ({ ...prev, ...data.context }));
      }
    } catch (error) {
      console.error('Message error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col bg-background border border-muted">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pr-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Bot className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                )}
              </div>

              {/* Eligibility Info */}
              {msg.eligibility && (
                <div
                  className={`ml-8 flex items-start gap-2 p-3 rounded-lg ${
                    msg.eligibility.eligible
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  {msg.eligibility.eligible ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">
                      {msg.eligibility.eligible ? 'You are eligible' : 'Eligibility Issue'}
                    </p>
                    <p className="text-xs mt-1">{msg.eligibility.reason}</p>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="ml-8 space-y-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleSuggestion(suggestion)}
                    >
                      <Lightbulb className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <CardContent className="border-t p-4 space-y-3">
        {Object.keys(context).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Object.entries(context).map(([key, value]: [string, any]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {String(value).substring(0, 20)}...
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about services, eligibility, or requirements..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
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
      </CardContent>
    </Card>
  );
}
