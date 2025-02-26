"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Animated typing indicator component
const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "600ms" }}></div>
    </div>
  )
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, isTyping?: boolean}>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setInput("")
    setIsLoading(true)
    
    // Add typing indicator
    setMessages(prev => [...prev, { text: "", isUser: false, isTyping: true }])

    try {
      const response = await fetch('http://localhost:5678/webhook/asvabbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: userMessage,
          timestamp: new Date().toISOString() 
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}`)
      }

      const rawData = await response.text()
      console.log('Raw response:', rawData)
      
      let data
      try {
        data = JSON.parse(rawData)
        console.log('Parsed data:', data)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        throw new Error('Failed to parse response')
      }

      // Remove the typing indicator
      setMessages(prev => prev.slice(0, -1))

      // Handle both array format and direct object format
      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].output) {
          setMessages(prev => [...prev, { text: data[0].output, isUser: false }])
        } else {
          throw new Error('Invalid array response format')
        }
      } else if (typeof data === 'object' && data !== null) {
        // Try to find output in the response object
        const output = data.output || data.response || data.message || data.text
        if (output) {
          setMessages(prev => [...prev, { text: output, isUser: false }])
        } else {
          throw new Error('No output found in response')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: unknown) {
      console.error('Error details:', error)
      
      // Remove the typing indicator
      setMessages(prev => prev.slice(0, -1))
      
      setMessages(prev => [...prev, { 
        text: error instanceof Error && error.message === 'Failed to parse response'
          ? "I received an invalid response format. Please try again."
          : "I apologize, but I'm having trouble connecting to the service at the moment. Please try again later.", 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300",
          isOpen && "translate-x-[350px]"
        )}
      >
        <Button
          className="h-32 w-10 rounded-l-lg rounded-r-none shadow-lg flex flex-col items-center justify-center gap-2 bg-primary hover:translate-x-1 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="vertical-text text-xs font-medium tracking-wider">
            {isOpen ? "CLOSE" : "CHAT"}
          </span>
        </Button>
      </div>
      
      {/* Chat Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[350px] bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ASVAB Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Container */}
        <div className="flex flex-col h-[calc(100%-8rem)] p-4 overflow-y-auto scrollbar-hide">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
              <p>Ask any questions about ASVAB test preparation, and I'll help you out!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[85%] shadow-sm",
                      msg.isUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    {msg.isTyping ? <TypingIndicator /> : msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={sendMessage} 
          className="h-16 border-t p-2 flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 
