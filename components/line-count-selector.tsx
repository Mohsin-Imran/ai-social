"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
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

  const presets = [5, 10, 25, 50, 100]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <AlignLeft className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-slate-300">Content Length (lines)</span>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={decrement}
          disabled={lineCount <= 1}
          className="w-10 h-10 p-0 glass-button text-white hover:bg-green-500 hover:border-green-400 rounded-lg transition-all duration-200"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-20 text-center glass-card border-white/20 focus:border-blue-400 text-white bg-blue-500/20 focus:bg-blue-500/30"
        />
        <Button
          onClick={increment}
          className="w-10 h-10 p-0 glass-button text-white hover:bg-green-500 hover:border-green-400 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset}
            onClick={() => {
              setLineCount(preset)
              setInputValue(preset.toString())
            }}
            className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
              lineCount === preset
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                : "glass-button text-slate-300 hover:text-white hover:bg-green-500 hover:border-green-400"
            }`}
          >
            {preset} lines
          </Button>
        ))}
      </div>
    </div>
  )
}
