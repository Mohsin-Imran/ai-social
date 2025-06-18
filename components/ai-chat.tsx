"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-with-jerry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.slice(-6),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Connection Error",
        description: "Unable to reach AI assistant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    "Help me brainstorm content ideas",
    "What are the best hashtags for my niche?",
    "How can I increase engagement?",
    "What's trending on social media?",
    "Give me caption ideas",
    "Help with content strategy",
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="h-[calc(100vh-200px)]">
        {/* Single Full-Width Chat Interface */}
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Chat with Jerry</h1>
                <p className="text-green-100 text-sm">Your AI Creative Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-medium text-gray-900">{message.role === "user" ? "You" : "Jerry"}</div>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-medium text-gray-900">Jerry</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about content creation..."
                  className="w-full h-14 pl-6 pr-16 text-base border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 bg-gray-100 shadow-sm placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="absolute right-3 top-3 h-8 w-8 p-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Bot className="w-3 h-3" />
                  <span>AI can make mistakes. Consider checking important information.</span>
                </div>
                <div className="text-xs text-gray-400">Press Enter to send</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
