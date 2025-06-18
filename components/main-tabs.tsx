"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ContentGenerator } from "@/components/content-generator"
import { ChatWithJerry } from "@/components/chat-with-jerry"
import { Sparkles, Bot, Zap, MessageCircle } from "lucide-react"

export function MainTabs() {
  const [activeTab, setActiveTab] = useState("content-creator")

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Custom Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-dark rounded-2xl p-2 inline-flex space-x-2">
            <button
              onClick={() => setActiveTab("content-creator")}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "content-creator"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="relative">
                <Sparkles className="h-5 w-5" />
                {activeTab === "content-creator" && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                )}
              </div>
              <span>AI Creator</span>
              <Zap className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab("chat-with-jerry")}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "chat-with-jerry"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="relative">
                <Bot className="h-5 w-5" />
                {activeTab === "chat-with-jerry" && (
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </div>
              <span>Chat Jerry</span>
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        <TabsContent value="content-creator" className="mt-0">
          <ContentGenerator />
        </TabsContent>

        <TabsContent value="chat-with-jerry" className="mt-0">
          <ChatWithJerry />
        </TabsContent>
      </Tabs>
    </div>
  )
}
