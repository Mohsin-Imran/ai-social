"use client"

import { Button } from "@/components/ui/button"
import { Wand2, Loader2, Sparkles } from "lucide-react"

interface GenerateButtonProps {
  onGenerate: () => void
  isGenerating: boolean
  hasMedia: boolean
  customPrompt: string
}

export function GenerateButton({ onGenerate, isGenerating, hasMedia, customPrompt }: GenerateButtonProps) {
  return (
    <Button
      onClick={onGenerate}
      disabled={isGenerating || !hasMedia}
      className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl button-hover animate-gradient"
    >
      <div className="flex items-center justify-center space-x-3 relative z-10">
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Content...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            <span>{customPrompt ? "Generate with Custom Prompt" : "Generate Content"}</span>
            <Sparkles className="w-4 h-4" />
          </>
        )}
      </div>
    </Button>
  )
}
