"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import type { Platform } from "./content-generator"

interface PlatformSelectorProps {
  platform: Platform
  setPlatform: (platform: Platform) => void
}

export function PlatformSelector({ platform, setPlatform }: PlatformSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={platform}
      onValueChange={(value) => value && setPlatform(value as Platform)}
      className="grid grid-cols-2 gap-3"
    >
      <ToggleGroupItem
        value="instagram"
        aria-label="Instagram"
        className="h-16 flex-col space-y-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-pink-500 data-[state=on]:to-orange-500 data-[state=on]:text-white border-2 hover:border-pink-300 transition-all duration-200"
      >
        <Instagram className="h-5 w-5" />
        <span className="text-xs font-medium">Instagram</span>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="twitter"
        aria-label="Twitter"
        className="h-16 flex-col space-y-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-400 data-[state=on]:to-blue-600 data-[state=on]:text-white border-2 hover:border-blue-300 transition-all duration-200"
      >
        <Twitter className="h-5 w-5" />
        <span className="text-xs font-medium">Twitter/X</span>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="facebook"
        aria-label="Facebook"
        className="h-16 flex-col space-y-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-600 data-[state=on]:to-indigo-600 data-[state=on]:text-white border-2 hover:border-blue-300 transition-all duration-200"
      >
        <Facebook className="h-5 w-5" />
        <span className="text-xs font-medium">Facebook</span>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="linkedin"
        aria-label="LinkedIn"
        className="h-16 flex-col space-y-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-700 data-[state=on]:to-blue-800 data-[state=on]:text-white border-2 hover:border-blue-300 transition-all duration-200"
      >
        <Linkedin className="h-5 w-5" />
        <span className="text-xs font-medium">LinkedIn</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
