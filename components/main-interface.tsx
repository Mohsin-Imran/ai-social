"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { NavigationTabs } from "@/components/navigation-tabs"
import { ContentCreator } from "@/components/content-creator"
import { AIChat } from "@/components/ai-chat"

export function MainInterface() {
  const [activeTab, setActiveTab] = useState<"create" | "chat">("create")

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">{activeTab === "create" ? <ContentCreator /> : <AIChat />}</div>
      </div>
    </div>
  )
}
