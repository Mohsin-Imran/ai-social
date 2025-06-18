"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, MoreVertical, Trash2, Sparkles, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatWithJerry() {
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
        description: "Unable to reach Jerry. Please try again.",
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

  const clearChat = () => {
    setMessages([])
    toast({
      title: "✨ Chat cleared",
      description: "Ready for a fresh conversation!",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="h-[calc(100vh-200px)] flex flex-col glass-dark border-white/20 overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center shadow-2xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-black">Jerry AI</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">Ready to help you create!</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-white hover:bg-white/20 rounded-xl">
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-dark border-white/20">
                <DropdownMenuItem onClick={clearChat} className="text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="relative">
                <div className="w-32 h-32 glass rounded-3xl flex items-center justify-center shadow-2xl">
                  <Bot className="h-16 w-16 text-purple-400" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4 max-w-lg">
                <h3 className="text-4xl font-black text-white">Hey there! 👋</h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  I'm Jerry, your AI creative partner! Ask me anything about content creation, marketing strategies, or
                  just chat about your ideas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="px-6 py-3 glass rounded-full text-white font-semibold flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Creative Ideas</span>
                </div>
                <div className="px-6 py-3 glass rounded-full text-white font-semibold flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Content Strategy</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-6 w-6 text-white" />
                      ) : (
                        <Bot className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-6 py-4 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "glass text-white border border-white/20"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === "user" ? "text-purple-100" : "text-gray-400"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="glass rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <span className="text-gray-300 ml-2">Jerry is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-6 glass border-t border-white/20">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Jerry anything... ✨"
                className="h-14 pr-16 border-2 border-white/20 focus:border-purple-400 focus:ring-purple-400 rounded-xl glass text-white placeholder:text-gray-400 text-lg"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Press Enter to send • Jerry is powered by advanced AI
          </p>
        </div>
      </Card>
    </div>
  )
}
