"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Check, Share, Sparkles, Download } from "lucide-react"
import { PlatformIcon } from "@/components/platform-icon"
import { toast } from "@/components/ui/use-toast"
import type { Platform } from "@/types"
import type { Language } from "@/components/language-selector"

interface ContentOutputProps {
  content: string
  isLoading: boolean
  platform: Platform
  language: Language
}

export function ContentOutput({ content, isLoading, platform, language }: ContentOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const getLanguageFlag = () => {
    const flags: { [key: string]: string } = {
      english: "🇺🇸",
      spanish: "🇪🇸",
      german: "🇩🇪",
      french: "🇫🇷",
    }
    return flags[language] || "🌐"
  }

  return (
    <div className="space-y-4 sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Generated Content</h3>
            <p className="text-xs text-gray-600">Ready to share</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <PlatformIcon platform={platform} className="w-3 h-3" />
            <span className="capitalize">{platform}</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <span>{getLanguageFlag()}</span>
            <span className="capitalize">{language}</span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share className="w-4 h-4 text-gray-700" />
              <span className="font-medium text-gray-800 text-sm">Your Content</span>
            </div>
            {content && (
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs button-hover"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                <span className="text-gray-600 text-sm">AI is creating your content...</span>
              </div>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-3 bg-gray-200 rounded"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          ) : content ? (
            <div className="space-y-4">
              <div className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">{content}</div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className="text-xs">Generated by AI</span>
                </div>

                <Button
                  onClick={handleCopy}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg px-4 py-2 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 button-hover"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto animate-float">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-medium text-gray-800">Ready to Create?</h3>
                  <p className="text-sm text-gray-600">Upload your media and generate amazing content!</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
