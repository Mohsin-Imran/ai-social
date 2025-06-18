"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon, Video, FileText, Loader2, Camera, Film } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface MediaUploaderProps {
  onMediaUpload: (file: File, type: "image" | "video") => void
  mediaPreview: string | null
  mediaType: "image" | "video"
  onExtractText?: (text: string) => void
}

export function MediaUploader({ onMediaUpload, mediaPreview, mediaType, onExtractText }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [activeType, setActiveType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null

      if (type) {
        onMediaUpload(file, type)
        setActiveType(type)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null

      if (type) {
        onMediaUpload(file, type)
        setActiveType(type)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleExtractText = async () => {
    if (!mediaPreview || !onExtractText || mediaType !== "image") return

    setIsExtracting(true)
    try {
      const response = await fetch(mediaPreview)
      const blob = await response.blob()
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("image", file)

      const extractResponse = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json()
        throw new Error(errorData.error || "Failed to extract text")
      }

      const data = await extractResponse.json()

      if (data.text) {
        onExtractText(data.text)
        toast({
          title: "Text extracted!",
          description: "Text from your image has been extracted.",
        })
      } else {
        toast({
          title: "No text found",
          description: "No readable text was found in the image.",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Failed to extract text",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Upload Media</h2>
            <p className="text-sm text-gray-600">Choose your image or video</p>
          </div>
        </div>

        {/* Type Selector */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveType("image")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all button-hover ${
              activeType === "image"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </Button>
          <Button
            onClick={() => setActiveType("video")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all button-hover ${
              activeType === "video"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </Button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
            isDragging
              ? "border-blue-400 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {mediaPreview ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden shadow-md">
                {mediaType === "image" ? (
                  <img
                    src={mediaPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", mediaPreview)
                      e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-48 object-cover"
                    controls
                    onError={(e) => {
                      console.error("Video failed to load:", mediaPreview)
                    }}
                  />
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleButtonClick}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg py-2 button-hover"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change {mediaType}
                </Button>

                {mediaType === "image" && onExtractText && (
                  <Button
                    onClick={handleExtractText}
                    disabled={isExtracting}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg py-2 button-hover"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Extract Text
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center animate-float">
                  {activeType === "image" ? (
                    <ImageIcon className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Film className="w-8 h-8 text-emerald-600" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Upload className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium text-gray-800">Drop your {activeType} here</h3>
                <p className="text-sm text-gray-600">or click to browse your files</p>
                <p className="text-xs text-gray-500">
                  {activeType === "image" ? "JPG, PNG, WEBP" : "MP4, MOV, AVI"} (max 10MB)
                </p>
              </div>

              <Button
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 button-hover"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose {activeType}
              </Button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={activeType === "image" ? "image/*" : "video/*"}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
