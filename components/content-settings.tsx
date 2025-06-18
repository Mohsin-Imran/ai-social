"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PlatformSelector } from "@/components/platform-selector"
import { ToneSelector } from "@/components/tone-selector"
import { LineCountSelector } from "@/components/line-count-selector"
import { LanguageSelector, type Language } from "@/components/language-selector"
import { Settings, Sliders } from "lucide-react"
import type { Platform, Tone } from "@/types"

interface ContentSettingsProps {
  platform: Platform
  setPlatform: (platform: Platform) => void
  tone: Tone
  setTone: (tone: Tone) => void
  lineCount: number
  setLineCount: (count: number) => void
  language: Language
  setLanguage: (language: Language) => void
}

export function ContentSettings({
  platform,
  setPlatform,
  tone,
  setTone,
  lineCount,
  setLineCount,
  language,
  setLanguage,
}: ContentSettingsProps) {
  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Content Settings</h2>
            <p className="text-sm text-gray-600">Customize your generation</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-3">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Length</span>
            </div>
            <LineCountSelector lineCount={lineCount} setLineCount={setLineCount} />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-3">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Language</span>
            </div>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>
        </div>

        {/* Platform & Tone */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Platform
            </h3>
            <PlatformSelector platform={platform} setPlatform={setPlatform} />
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Tone & Style
            </h3>
            <ToneSelector tone={tone} setTone={setTone} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
