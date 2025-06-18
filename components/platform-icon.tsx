"use client"

import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react"
import type { Platform } from "@/types"

interface PlatformIconProps {
  platform: Platform
  className?: string
}

export function PlatformIcon({ platform, className = "w-5 h-5" }: PlatformIconProps) {
  switch (platform) {
    case "instagram":
      return <Instagram className={className} />
    case "twitter":
      return <Twitter className={className} />
    case "facebook":
      return <Facebook className={className} />
    case "linkedin":
      return <Linkedin className={className} />
    default:
      return <Instagram className={className} />
  }
}
