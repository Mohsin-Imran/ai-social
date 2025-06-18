"use client"

import { Sparkles, Zap, Star } from "lucide-react"

export function Header() {
  return (
    <header className="relative py-8 text-center">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Star className="w-3 h-3 text-yellow-900" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="">
          <h1 className="text-4xl md:text-4xl font-bold text-gradient">AI Content Studio</h1>
        </div>
        {/* Stats */}
       
      </div>
    </header>
  )
}
