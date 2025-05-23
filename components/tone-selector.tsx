"use client"

import { RadioGroup } from "@/components/ui/radio-group"
import type { Tone } from "./content-generator"

interface ToneSelectorProps {
  tone: Tone
  setTone: (tone: Tone) => void
}

export function ToneSelector({ tone, setTone }: ToneSelectorProps) {
  const tones = [
    { value: "professional", label: "Professional", emoji: "💼", color: "from-gray-500 to-gray-700" },
    { value: "casual", label: "Casual", emoji: "😊", color: "from-green-500 to-teal-500" },
    { value: "humorous", label: "Humorous", emoji: "😄", color: "from-yellow-500 to-orange-500" },
    { value: "inspirational", label: "Inspirational", emoji: "✨", color: "from-purple-500 to-pink-500" },
  ]

  return (
    <RadioGroup value={tone} onValueChange={(value) => setTone(value as Tone)} className="grid grid-cols-2 gap-3">
      {tones.map((toneOption) => (
        <button
          key={toneOption.value}
          type="button"
          onClick={() => setTone(toneOption.value as Tone)}
          className={`flex flex-col items-center justify-center h-16 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
            tone === toneOption.value
              ? `border-transparent bg-gradient-to-r ${toneOption.color} text-white shadow-lg scale-105`
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className="text-xl mb-1">{toneOption.emoji}</span>
          <span className="text-xs font-medium text-center">{toneOption.label}</span>
        </button>
      ))}
    </RadioGroup>
  )
}
