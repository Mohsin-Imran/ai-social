"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Check, Twitter, Facebook, Instagram, Linkedin, Sparkles, Share, Zap } from "lucide-react"
import type { Platform } from "./content-generator"
import type { Language } from "./language-selector"
import { toast } from "@/components/ui/use-toast"

interface ContentDisplayProps {
  content: string
  isLoading: boolean
  platform: Platform
  language: Language
}

export function ContentDisplay({ content, isLoading, platform, language }: ContentDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast({
        title: "✨ Copied to clipboard!",
        description: "Your amazing content is ready to share!",
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
        return <Instagram className="h-5 w-5 text-white" />
      case "twitter":
        return <Twitter className="h-5 w-5 text-white" />
      case "facebook":
        return <Facebook className="h-5 w-5 text-white" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-white" />
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
        return "from-pink-500 via-purple-500 to-orange-500"
      case "twitter":
        return "from-blue-400 to-blue-600"
      case "facebook":
        return "from-blue-600 to-indigo-600"
      case "linkedin":
        return "from-blue-700 to-blue-800"
    }
  }

  const getLanguageFlag = () => {
    const flags: { [key: string]: string } = {
      english: "🇺🇸",
      english_uk: "🇬🇧",
      english_au: "🇦🇺",
      english_in: "🇮🇳",
      spanish: "🇪🇸",
      spanish_mx: "🇲🇽",
      spanish_ar: "🇦🇷",
      german: "🇩🇪",
      french: "🇫🇷",
      french_ca: "🇨🇦",
      hindi: "🇮🇳",
      urdu: "🇵🇰",
      arabic: "🇸🇦",
      chinese: "🇨🇳",
      chinese_traditional: "🇹🇼",
      japanese: "🇯🇵",
      korean: "🇰🇷",
      portuguese: "🇵🇹",
      portuguese_br: "🇧🇷",
      russian: "🇷🇺",
      italian: "🇮🇹",
    }
    return flags[language] || "🌐"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Your Content</h3>
        </div>
        <div className="flex space-x-2">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getPlatformGradient()} text-white font-semibold shadow-lg`}
          >
            {getPlatformIcon()}
            <span>{getPlatformName()}</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg">
            <span>{getLanguageFlag()}</span>
            <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
          </div>
        </div>
      </div>

      <Card className="glass-dark border-white/20 overflow-hidden sticky top-6">
        <CardHeader className={`bg-gradient-to-r ${getPlatformGradient()} text-white p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Share className="h-6 w-6" />
              <span className="font-bold text-xl">Ready to Share!</span>
              <span className="text-lg bg-white/20 px-3 py-1 rounded-full">{getLanguageFlag()}</span>
            </div>
            {content && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
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

        <CardContent className="p-8">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-gray-300 ml-2 font-medium">AI is crafting your content...</span>
              </div>
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-3/4 bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-2/3 bg-white/20" />
            </div>
          ) : content ? (
            <div className="space-y-4">
              <div className="whitespace-pre-line text-white leading-relaxed text-lg">{content}</div>
              <div className="flex items-center justify-center pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Powered by AI Magic ✨</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-6">
                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <Sparkles className="h-12 w-12 text-purple-400" />
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-white">Ready to Create Magic? ✨</p>
                  <p className="text-gray-400 text-lg">Upload your media and let AI transform it into viral content!</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
