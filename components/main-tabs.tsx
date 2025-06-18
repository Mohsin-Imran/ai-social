"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentGenerator } from "@/components/content-generator"
import { ChatWithJerry } from "@/components/chat-with-jerry"
import { Sparkles, MessageCircle } from "lucide-react"

export function MainTabs() {
  return (
    <Tabs defaultValue="content-creator" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg h-14">
        <TabsTrigger
          value="content-creator"
          className="flex items-center space-x-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
        >
          <Sparkles className="h-5 w-5" />
          <span>AI Content Creator</span>
        </TabsTrigger>
        <TabsTrigger
          value="chat-with-jerry"
          className="flex items-center space-x-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
        >
          <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <MessageCircle className="h-3 w-3 text-white" />
          </div>
          <span>Chat with Jerry</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content-creator" className="mt-6">
        <ContentGenerator />
      </TabsContent>

      <TabsContent value="chat-with-jerry" className="mt-6">
        <ChatWithJerry />
      </TabsContent>
    </Tabs>
  )
}
