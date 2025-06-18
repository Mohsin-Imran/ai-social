"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { VideoUploader } from "@/components/video-uploader"
import { ContentDisplay } from "@/components/content-display"
import { PlatformSelector } from "@/components/platform-selector"
import { ToneSelector } from "@/components/tone-selector"
import { LineCountSelector } from "@/components/line-count-selector"
import { LanguageSelector, type Language } from "@/components/language-selector"
import { CustomPromptInput } from "@/components/custom-prompt-input"
import { Loader2, Upload, Settings, Wand2, ImageIcon, Video } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ExtractedTextDisplay } from "@/components/extracted-text-display"

export type Platform = "instagram" | "twitter" | "facebook" | "linkedin"
export type Tone = "professional" | "casual" | "humorous" | "inspirational"

export function ContentGenerator() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [platform, setPlatform] = useState<Platform>("instagram")
  const [tone, setTone] = useState<Tone>("casual")
  const [lineCount, setLineCount] = useState<number>(10)
  const [language, setLanguage] = useState<Language>("english")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [extractedText, setExtractedText] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"image" | "video">("image")

  const handleImageUpload = (file: File) => {
    setImage(file)
    setVideo(null)
    setVideoPreview(null)
    setExtractedText("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleVideoUpload = (file: File) => {
    setVideo(file)
    setImage(null)
    setImagePreview(null)
    setExtractedText("")

    const reader = new FileReader()
    reader.onload = (e) => {
      setVideoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleExtractText = (text: string) => {
    setExtractedText(text)
  }

  const handleUseExtractedText = () => {
    if (!extractedText) return
    handleGenerateFromText(extractedText)
  }

  const handleGenerateFromText = async (text: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-from-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          platform,
          tone,
          lineCount,
          language,
          customPrompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()
      setContent(data.content)
      setError(null)
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "There was an error generating content. Please try again.")
      toast({
        title: "Error generating content",
        description:
          error instanceof Error ? error.message : "There was an error generating content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = async () => {
    const mediaFile = activeTab === "image" ? image : video

    if (!mediaFile) {
      toast({
        title: `No ${activeTab} selected`,
        description: `Please upload a ${activeTab} first`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("media", mediaFile)
      formData.append("mediaType", activeTab)
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
      setError(null)
    } catch (error) {
      console.error(error)
      setError(
        error instanceof Error ? error.message : `There was an error analyzing your ${activeTab}. Please try again.`,
      )
      toast({
        title: "Error generating content",
        description:
          error instanceof Error ? error.message : `There was an error analyzing your ${activeTab}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseCustomPrompt = () => {
    handleGenerate()
  }

  const hasMedia = (activeTab === "image" && image) || (activeTab === "video" && video)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column - Upload and Settings */}
      <div className="xl:col-span-2 space-y-6">
        {error && (
          <Alert variant="destructive" className="glass border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-400">Error</AlertTitle>
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Media Upload */}
        <Card className="glass-dark border-white/20 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Upload Media</h2>
                <p className="text-gray-400">Choose your image or video to transform</p>
              </div>
            </div>

            <div className="glass rounded-xl p-1 mb-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === "image"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === "video"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {activeTab === "image" ? (
              <ImageUploader
                onImageUpload={handleImageUpload}
                imagePreview={imagePreview}
                onExtractText={handleExtractText}
              />
            ) : (
              <VideoUploader onVideoUpload={handleVideoUpload} videoPreview={videoPreview} />
            )}
          </CardContent>
        </Card>

        {/* Extracted Text */}
        {extractedText && <ExtractedTextDisplay text={extractedText} onUseText={handleUseExtractedText} />}

        {/* Custom Prompt */}
        <CustomPromptInput
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          onUsePrompt={handleUseCustomPrompt}
          isGenerating={isGenerating}
          hasMedia={hasMedia}
        />

        {/* Settings */}
        <Card className="glass-dark border-white/20">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Customize</h2>
                <p className="text-gray-400">Fine-tune your content generation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-xl p-6">
                <LineCountSelector lineCount={lineCount} setLineCount={setLineCount} />
              </div>
              <div className="glass rounded-xl p-6">
                <LanguageSelector language={language} setLanguage={setLanguage} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Platform
                </h3>
                <PlatformSelector platform={platform} setPlatform={setPlatform} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Tone
                </h3>
                <ToneSelector tone={tone} setTone={setTone} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          disabled={isGenerating || !hasMedia}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-4 h-6 w-6 animate-spin" />
              <span className="animate-pulse">Creating Magic...</span>
            </>
          ) : (
            <>
              <Wand2 className="mr-4 h-6 w-6" />
              Generate Amazing Content
            </>
          )}
        </Button>
      </div>

      {/* Right Column - Content Display */}
      <div className="xl:col-span-1">
        <ContentDisplay content={content} isLoading={isGenerating} platform={platform} language={language} />
      </div>
    </div>
  )
}
