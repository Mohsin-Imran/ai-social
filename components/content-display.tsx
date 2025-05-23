"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Check, Twitter, Facebook, Instagram, Linkedin, Sparkles } from "lucide-react"
import type { Platform } from "./content-generator"
import { toast } from "@/components/ui/use-toast"

interface ContentDisplayProps {
  content: string
  isLoading: boolean
  platform: Platform
}

export function ContentDisplay({ content, isLoading, platform }: ContentDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast({
        title: "Copied to clipboard! 🎉",
        description: "Content has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-500" />
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />
    }
  }

  const getPlatformName = () => {
    switch (platform) {
      case "instagram":
        return "Instagram"
      case "twitter":
        return "Twitter/X"
      case "facebook":
        return "Facebook"
      case "linkedin":
        return "LinkedIn"
    }
  }

  const getPlatformGradient = () => {
    switch (platform) {
      case "instagram":
        return "from-pink-500 to-orange-500"
      case "twitter":
        return "from-blue-400 to-blue-600"
      case "facebook":
        return "from-blue-600 to-indigo-600"
      case "linkedin":
        return "from-blue-700 to-blue-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-800">Generated Content</h3>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformGradient()} text-white text-sm font-medium`}
        >
          {getPlatformIcon()}
          <span>{getPlatformName()}</span>
        </div>
      </div>

      <Card className="min-h-[400px] border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className={`bg-gradient-to-r ${getPlatformGradient()} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Your AI-Generated Content</span>
            {content && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col">
          {isLoading ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-sm text-gray-500 ml-2">AI is analyzing your content...</span>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : content ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 whitespace-pre-line text-gray-700 leading-relaxed">{content}</div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-600">Ready to create magic? ✨</p>
                  <p className="text-sm text-gray-500">
                    Upload your media and click "Generate" to create amazing content!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
