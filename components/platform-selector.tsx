"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react"
import type { Platform } from "@/types"

interface PlatformSelectorProps {
  platform: Platform
  setPlatform: (platform: Platform) => void
}

export function PlatformSelector({ platform, setPlatform }: PlatformSelectorProps) {
  const platforms = [
    {
      id: "instagram" as Platform,
      name: "Instagram",
      icon: Instagram,
      color: "from-pink-500 to-orange-500",
      bgColor: "bg-pink-50 hover:bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      id: "twitter" as Platform,
      name: "Twitter",
      icon: Twitter,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: "facebook" as Platform,
      name: "Facebook",
      icon: Facebook,
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      id: "linkedin" as Platform,
      name: "LinkedIn",
      icon: Linkedin,
      color: "from-blue-700 to-blue-800",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {platforms.map((p) => {
        const Icon = p.icon
        const isSelected = platform === p.id

        return (
          <Button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`h-16 flex-col space-y-1 transition-all duration-300 button-hover ${
              isSelected
                ? `bg-gradient-to-r ${p.color} text-white shadow-md hover:shadow-lg`
                : `${p.bgColor} ${p.textColor} border border-gray-200`
            } rounded-lg`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{p.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
