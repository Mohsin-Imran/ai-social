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
import { Loader2, Sparkles, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

    // Generate content based on the extracted text
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
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 p-1">
          <CardContent className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload and Settings */}
              <div className="space-y-6">
                {/* Media Upload Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Upload Your Media</h2>
                  </div>

                  <Tabs defaultValue="image" onValueChange={(value) => setActiveTab(value as "image" | "video")}>
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-blue-100 p-1">
                      <TabsTrigger
                        value="image"
                        className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md transition-all duration-200"
                      >
                        📸 Image
                      </TabsTrigger>
                      <TabsTrigger
                        value="video"
                        className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-200"
                      >
                        🎥 Video
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="image" className="mt-4">
                      <ImageUploader
                        onImageUpload={handleImageUpload}
                        imagePreview={imagePreview}
                        onExtractText={handleExtractText}
                      />
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                      <VideoUploader onVideoUpload={handleVideoUpload} videoPreview={videoPreview} />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Extracted Text Display */}
                {extractedText && <ExtractedTextDisplay text={extractedText} onUseText={handleUseExtractedText} />}

                {/* Custom Prompt Input */}
                <CustomPromptInput
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                  onUsePrompt={handleUseCustomPrompt}
                  isGenerating={isGenerating}
                  hasMedia={hasMedia}
                />

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Line Count Selector */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                    <LineCountSelector lineCount={lineCount} setLineCount={setLineCount} />
                  </div>

                  {/* Language Selector */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <LanguageSelector language={language} setLanguage={setLanguage} />
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Choose Platform</h3>
                  </div>
                  <PlatformSelector platform={platform} setPlatform={setPlatform} />
                </div>

                {/* Tone Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Select Tone</h3>
                  </div>
                  <ToneSelector tone={tone} setTone={setTone} />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isGenerating || !hasMedia}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      <span className="animate-pulse">
                        Creating {lineCount} lines in {language}...
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-5 w-5" />
                      {customPrompt
                        ? "Generate with Custom Prompt"
                        : `Generate in ${language.charAt(0).toUpperCase() + language.slice(1)}`}{" "}
                      ✨
                    </>
                  )}
                </Button>
              </div>

              {/* Right Column - Content Display */}
              <ContentDisplay content={content} isLoading={isGenerating} platform={platform} language={language} />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
