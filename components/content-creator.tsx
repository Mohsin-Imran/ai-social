"use client"

import { useState } from "react"
import { MediaUploader } from "@/components/media-uploader"
import { ContentSettings } from "@/components/content-settings"
import { ContentOutput } from "@/components/content-output"
import { CustomPrompt } from "@/components/custom-prompt"
import { GenerateButton } from "@/components/generate-button"
import { ExtractedTextDisplay } from "@/components/extracted-text-display"
import { toast } from "@/components/ui/use-toast"
import type { Platform, Tone } from "@/types"
import type { Language } from "@/components/language-selector"

export function ContentCreator() {
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const [platform, setPlatform] = useState<Platform>("instagram")
  const [tone, setTone] = useState<Tone>("casual")
  const [lineCount, setLineCount] = useState<number>(10)
  const [language, setLanguage] = useState<Language>("english")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [extractedText, setExtractedText] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleMediaUpload = (file: File, type: "image" | "video") => {
    setMediaFile(file)
    setMediaType(type)
    setExtractedText("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleExtractText = (text: string) => {
    setExtractedText(text)
  }

  const handleGenerate = async () => {
    if (!mediaFile) {
      toast({
        title: "No media selected",
        description: "Please upload an image or video first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("media", mediaFile)
      formData.append("mediaType", mediaType)
      formData.append("platform", platform)
      formData.append("tone", tone)
      formData.append("lineCount", lineCount.toString())
      formData.append("language", language)
      formData.append("customPrompt", customPrompt)

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()
      setContent(data.content)

      toast({
        title: "Content Generated!",
        description: "Your content is ready to share!",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Controls */}
      <div className="w-full space-y-6">
        {/* Media Upload */}
        <MediaUploader
          onMediaUpload={handleMediaUpload}
          mediaPreview={mediaPreview}
          mediaType={mediaType}
          onExtractText={handleExtractText}
        />

        {/* Extracted Text */}
        {extractedText && (
          <ExtractedTextDisplay
            text={extractedText}
            onUseText={() => {
              // Handle using extracted text
            }}
          />
        )}

        {/* Custom Prompt */}
        <CustomPrompt
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasMedia={!!mediaFile}
        />

        {/* Settings */}
        <ContentSettings
          platform={platform}
          setPlatform={setPlatform}
          tone={tone}
          setTone={setTone}
          lineCount={lineCount}
          setLineCount={setLineCount}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Generate Button */}
        <GenerateButton
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasMedia={!!mediaFile}
          customPrompt={customPrompt}
        />
      </div>

      {/* Right Panel - Output */}
      <div className="w-full">
        <ContentOutput content={content} isLoading={isGenerating} platform={platform} language={language} />
      </div>
    </div>
  )
}
