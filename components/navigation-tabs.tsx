"use client"

import { Button } from "@/components/ui/button"
import { Wand2, MessageSquare, Sparkles, Bot } from "lucide-react"

interface NavigationTabsProps {
  activeTab: "create" | "chat"
  onTabChange: (tab: "create" | "chat") => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200 inline-flex space-x-1">
        <Button
          onClick={() => onTabChange("create")}
          className={`relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 button-hover ${
            activeTab === "create"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-2 relative z-10">
            <Wand2 className="w-4 h-4" />
            <span>Content Creator</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </Button>

        <Button
          onClick={() => onTabChange("chat")}
          className={`relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 button-hover ${
            activeTab === "chat"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-2 relative z-10">
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
            <MessageSquare className="w-3 h-3" />
          </div>
        </Button>
      </div>
    </div>
  )
}
