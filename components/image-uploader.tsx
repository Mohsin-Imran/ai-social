"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon, Camera, FileText, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  imagePreview: string | null
  onExtractText?: (text: string) => void
}

export function ImageUploader({ onImageUpload, imagePreview, onExtractText }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
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
      if (file.type.startsWith("image/")) {
        onImageUpload(file)
      } else {
        alert("Please upload an image file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleExtractText = async () => {
    if (!imagePreview || !onExtractText) return

    setIsExtracting(true)
    try {
      // Convert data URL to blob
      const response = await fetch(imagePreview)
      const blob = await response.blob()

      // Create a File object from the blob
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })

      // Create FormData
      const formData = new FormData()
      formData.append("image", file)

      // Send to API
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
          title: "Text extracted successfully! ✨",
          description: "The text from your image has been extracted.",
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
        title: "Error extracting text",
        description: error instanceof Error ? error.message : "There was an error extracting text from your image.",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
          : "border-gray-300 hover:border-purple-300 hover:shadow-md"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        {imagePreview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Image
              </Button>

              {onExtractText && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExtractText}
                  disabled={isExtracting}
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Extract Text
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-purple-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">Drop your image here</p>
              <p className="text-sm text-gray-500">or click to browse your files</p>
              <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP (max 10MB)</p>
            </div>

            <Button
              type="button"
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
