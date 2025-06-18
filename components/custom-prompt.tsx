"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Wand2, RotateCcw, Lightbulb, Sparkles } from "lucide-react"

interface CustomPromptProps {
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  onGenerate: () => void
  isGenerating: boolean
  hasMedia: boolean
}

export function CustomPrompt({ customPrompt, setCustomPrompt, onGenerate, isGenerating, hasMedia }: CustomPromptProps) {
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
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setCustomPrompt(suggestion)
    setShowSuggestions(false)
  }

  const clearPrompt = () => {
    setCustomPrompt("")
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Custom Prompt</h2>
              <p className="text-sm text-gray-600">Tell AI exactly what you want</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg button-hover"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Ideas
            </Button>
            {customPrompt && (
              <Button
                onClick={clearPrompt}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg button-hover"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <Textarea
          placeholder="Tell the AI exactly what kind of content you want... 
For example: 'Create a post that asks my followers about their favorite weekend activities' or 'Write something that promotes my new product launch with excitement'"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="min-h-[120px] resize-none border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-lg bg-white text-gray-800 placeholder:text-gray-500"
          rows={5}
        />

        {/* Suggestions */}
        {showSuggestions && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Prompt Ideas:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto scrollbar-hide">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-sm p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-all duration-300 border border-gray-200 hover:border-gray-300 button-hover"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {customPrompt && (
          <div className="mt-6">
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !hasMedia}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 button-hover"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Generating with Custom Prompt...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-3" />
                  Generate with Custom Prompt
                </>
              )}
            </Button>
          </div>
        )}

        {/* Tip */}
        <p className="text-xs text-gray-500 mt-4 flex items-center">
          <Sparkles className="w-3 h-3 mr-2 text-green-500" />
          Tip: Be specific about the tone, style, or message you want. The AI will combine your prompt with the uploaded
          media.
        </p>
      </CardContent>
    </Card>
  )
}
