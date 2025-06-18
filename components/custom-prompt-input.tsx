"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Wand2, RotateCcw, Lightbulb } from "lucide-react"

interface CustomPromptInputProps {
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  onUsePrompt: () => void
  isGenerating: boolean
  hasMedia: boolean
}

export function CustomPromptInput({
  customPrompt,
  setCustomPrompt,
  onUsePrompt,
  isGenerating,
  hasMedia,
}: CustomPromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const promptSuggestions = [
    "Create a motivational post about overcoming challenges",
    "Write a funny caption that will make people laugh",
    "Generate a professional post about industry trends",
    "Create content that encourages engagement and comments",
    "Write a storytelling post that connects with the audience",
    "Generate a post that highlights the benefits of this product/service",
    "Create content that asks a question to spark discussion",
    "Write a behind-the-scenes style post",
    "Generate a post that shares a valuable tip or advice",
    "Create content that celebrates an achievement or milestone",
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setCustomPrompt(suggestion)
    setShowSuggestions(false)
  }

  const clearPrompt = () => {
    setCustomPrompt("")
  }

  return (
    <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-green-500" />
            <Label htmlFor="customPrompt" className="text-sm font-medium text-gray-800">
              Custom Prompt (Optional)
            </Label>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Ideas
            </Button>
            {customPrompt && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearPrompt}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <Textarea
          id="customPrompt"
          placeholder="Tell the AI exactly what kind of content you want... 
For example: 'Create a post that asks my followers about their favorite weekend activities' or 'Write something that promotes my new product launch with excitement'"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="min-h-[100px] resize-none border-green-200 focus:border-green-400 focus:ring-green-400"
          rows={4}
        />

        {showSuggestions && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">💡 Prompt Ideas:</p>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-xs p-2 bg-white border border-green-100 rounded-md hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {customPrompt && (
          <div className="flex space-x-2">
            <Button
              onClick={onUsePrompt}
              disabled={isGenerating || !hasMedia}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate with Custom Prompt
                </>
              )}
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500">
          💡 Tip: Be specific about the tone, style, or message you want. The AI will combine your prompt with the
          uploaded media to create personalized content.
        </p>
      </CardContent>
    </Card>
  )
}
