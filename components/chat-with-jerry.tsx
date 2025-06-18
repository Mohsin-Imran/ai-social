"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, Trash2, Sparkles, MessageCircle, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatWithJerry() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hey there! I'm Jerry, your AI assistant! I'm here to help you with anything you need:\n\n✨ **Creative Ideas & Brainstorming**\n📝 **Writing & Content Creation**\n💡 **Problem Solving & Advice**\n🎯 **Marketing & Business Strategy**\n🔧 **Technical Questions & Tutorials**\n🎨 **Design & Visual Content Tips**\n📚 **Learning & Research Help**\n\nWhat would you like to chat about today? Ask me anything! 🚀",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const quickStarters = [
    "💡 Help me brainstorm content ideas",
    "📈 How can I grow my social media following?",
    "✍️ Write a compelling product description",
    "🎯 Create a marketing strategy for my business",
    "🔍 Research trending topics in my industry",
    "🎨 Give me design tips for social media posts",
    "📊 Explain social media analytics",
    "💰 How to monetize my content?",
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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
          history: messages.slice(-8), // Send last 8 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Jerry")
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
        title: "Oops! Something went wrong",
        description: "Jerry is having trouble responding right now. Please try again in a moment.",
        variant: "destructive",
      })

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having some technical difficulties right now. Please try asking your question again! 🔧",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
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
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hey there! I'm Jerry, your AI assistant! I'm here to help you with anything you need:\n\n✨ **Creative Ideas & Brainstorming**\n📝 **Writing & Content Creation**\n💡 **Problem Solving & Advice**\n🎯 **Marketing & Business Strategy**\n🔧 **Technical Questions & Tutorials**\n🎨 **Design & Visual Content Tips**\n📚 **Learning & Research Help**\n\nWhat would you like to chat about today? Ask me anything! 🚀",
        timestamp: new Date(),
      },
    ])
    toast({
      title: "Chat cleared! 🧹",
      description: "Ready for a fresh conversation with Jerry!",
    })
  }

  const handleQuickStarter = (starter: string) => {
    setInput(starter.replace(/^[💡📈✍️🎯🔍🎨📊💰]\s/u, "")) // Remove emoji prefix
    textareaRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-1">
          <CardContent className="bg-white rounded-lg p-0">
            {/* Chat Header */}
            <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Chat with Jerry</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-100 text-sm">Online & Ready to Help!</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <div className="h-[600px] flex flex-col">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gray-50 text-gray-800 border border-gray-100"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {message.role === "user" && (
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                            <div
                              className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 rounded-2xl p-4 max-w-[85%] border border-gray-100 shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <span className="text-sm text-gray-500 ml-2">Jerry is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Starters */}
              {messages.length <= 1 && (
                <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700">Quick Conversation Starters:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickStarters.map((starter, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickStarter(starter)}
                        className="text-left text-sm p-3 bg-white border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-200 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-6 border-t bg-white">
                <div className="flex space-x-4">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Jerry anything... 💬"
                    className="flex-1 min-h-[50px] max-h-[120px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                    rows={2}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
