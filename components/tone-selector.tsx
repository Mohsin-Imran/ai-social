"use client"

import { Button } from "@/components/ui/button"
import type { Tone } from "@/types"

interface ToneSelectorProps {
  tone: Tone
  setTone: (tone: Tone) => void
}

export function ToneSelector({ tone, setTone }: ToneSelectorProps) {
  const tones = [
    {
      id: "professional" as Tone,
      name: "Professional",
      emoji: "💼",
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50 hover:bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      id: "casual" as Tone,
      name: "Casual",
      emoji: "😊",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-600",
    },
    {
      id: "humorous" as Tone,
      name: "Humorous",
      emoji: "😄",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      textColor: "text-orange-600",
    },
    {
      id: "inspirational" as Tone,
      name: "Inspirational",
      emoji: "✨",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {tones.map((t) => {
        const isSelected = tone === t.id

        return (
          <Button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={`h-16 flex-col space-y-1 transition-all duration-300 button-hover ${
              isSelected
                ? `bg-gradient-to-r ${t.color} text-white shadow-md hover:shadow-lg`
                : `${t.bgColor} ${t.textColor} border border-gray-200`
            } rounded-lg`}
          >
            <span className="text-lg">{t.emoji}</span>
            <span className="text-xs font-medium">{t.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
