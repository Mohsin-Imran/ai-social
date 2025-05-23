"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Wand2 } from "lucide-react"

interface ExtractedTextDisplayProps {
  text: string
  onUseText: () => void
}

export function ExtractedTextDisplay({ text, onUseText }: ExtractedTextDisplayProps) {
  if (!text) return null

  return (
    <Card className="border border-blue-200 bg-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-t-lg">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span className="font-medium">Extracted Text</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="max-h-40 overflow-y-auto mb-3 text-sm text-gray-700 bg-white p-3 rounded border border-blue-100">
          {text}
        </div>
        <Button
          onClick={onUseText}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
          size="sm"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Use This Text for Content
        </Button>
      </CardContent>
    </Card>
  )
}
