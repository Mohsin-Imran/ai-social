"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Minus, Plus, AlignLeft } from "lucide-react"

interface LineCountSelectorProps {
  lineCount: number
  setLineCount: (count: number) => void
}

export function LineCountSelector({ lineCount, setLineCount }: LineCountSelectorProps) {
  const [inputValue, setInputValue] = useState(lineCount.toString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    const count = Number.parseInt(inputValue)
    if (!isNaN(count) && count > 0) {
      setLineCount(count)
    } else {
      setInputValue(lineCount.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur()
    }
  }

  const increment = () => {
    const newCount = lineCount + 1
    setLineCount(newCount)
    setInputValue(newCount.toString())
  }

  const decrement = () => {
    if (lineCount > 1) {
      const newCount = lineCount - 1
      setLineCount(newCount)
      setInputValue(newCount.toString())
    }
  }

  // Preset values
  const presets = [5, 10, 25, 50, 100]

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <AlignLeft className="h-4 w-4 text-purple-500" />
        <Label htmlFor="lineCount" className="text-sm font-medium">
          Content Length (lines)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={lineCount <= 1}
          className="h-9 w-9 rounded-md border-gray-200"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id="lineCount"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-9 w-24 text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          className="h-9 w-9 rounded-md border-gray-200"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {presets.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setLineCount(preset)
              setInputValue(preset.toString())
            }}
            className={`px-3 py-1 text-xs ${
              lineCount === preset
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            }`}
          >
            {preset} lines
          </Button>
        ))}
      </div>
    </div>
  )
}
