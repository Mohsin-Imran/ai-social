"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, VideoIcon, Film } from "lucide-react"

interface VideoUploaderProps {
  onVideoUpload: (file: File) => void
  videoPreview: string | null
}

export function VideoUploader({ onVideoUpload, videoPreview }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
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
      if (file.type.startsWith("video/")) {
        onVideoUpload(file)
      } else {
        alert("Please upload a video file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoUpload(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
          : "border-gray-300 hover:border-blue-300 hover:shadow-md"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        {videoPreview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
              <video src={videoPreview} className="w-full h-full object-cover" controls preload="metadata">
                Your browser does not support the video tag.
              </video>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              <Film className="h-4 w-4 mr-2" />
              Change Video
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <VideoIcon className="h-12 w-12 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">Drop your video here</p>
              <p className="text-sm text-gray-500">or click to browse your files</p>
              <p className="text-xs text-gray-400">Supports MP4, MOV, AVI (max 10MB)</p>
            </div>

            <Button
              type="button"
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Video
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4,video/mov,video/avi,video/quicktime"
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
