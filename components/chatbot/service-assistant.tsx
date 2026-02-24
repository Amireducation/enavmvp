import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Loader, HelpCircle } from 'lucide-react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ServiceAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  userName?: string;
}

export function ServiceAssistant({ isOpen = true, onClose, userName }: ServiceAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Service Assistant. I can help you find information about government services, check application status, explain requirements, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    'What services are available?',
    'How long does it take to process my request?',
    'What documents do I need to provide?',
    'Track my application status',
    'How much will it cost?'
  ];

  const handleSendMessage = async (message: string = inputValue) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);

    // Simulate AI response (in production, this would call Azure OpenAI API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'services': 'We offer various government services including Health Insurance, Business License, Passport Application, Land Registration, Scholarships, Marriage Certificate, Tax ID, Driving License, and Import/Export License.',
        'process': 'Processing times vary by service. Most services take 3-10 business days. Some urgent services can be processed within 1-2 days.',
        'document': 'Required documents depend on the service. Common documents include ID, proof of residence, and service-specific documents. Please select a service for specific requirements.',
        'status': 'To check your application status, please visit your dashboard or provide your request tracking number.',
        'cost': 'Service costs vary. Some services are free (like Health Insurance), while others range from 50 ETB to 2,500 ETB.',
        'default': 'That\'s a great question! Could you provide more details about which service you\'re interested in? This will help me give you more specific information.'
      };

      const messageContent = message.toLowerCase();
      let responseContent = responses.default;

      if (messageContent.includes('service') || messageContent.includes('available')) {
        responseContent = responses.services;
      } else if (messageContent.includes('time') || messageContent.includes('process') || messageContent.includes('long')) {
        responseContent = responses.process;
      } else if (messageContent.includes('document') || messageContent.includes('require')) {
        responseContent = responses.document;
      } else if (messageContent.includes('status') || messageContent.includes('track')) {
        responseContent = responses.status;
      } else if (messageContent.includes('cost') || messageContent.includes('price') || messageContent.includes('fee')) {
        responseContent = responses.cost;
      }

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-card rounded-lg shadow-xl border border-border flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Service Assistant</h3>
            <p className="text-xs opacity-90">Always available to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-primary/80 rounded transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.type === 'user' ? 'opacity-70' : 'text-muted-foreground'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        {showSuggestions && messages.length === 1 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-muted-foreground font-semibold">Suggested questions:</p>
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(question)}
                className="w-full text-left text-sm px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-foreground"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <HelpCircle className="h-3 w-3" />
          <span>Ask me about services, requirements, and application status</span>
        </div>
      </div>
    </div>
  );
}
