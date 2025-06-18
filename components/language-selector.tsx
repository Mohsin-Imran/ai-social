"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Language =
  | "english"
  | "spanish"
  | "german"
  | "french"
  | "hindi"
  | "urdu"
  | "arabic"
  | "chinese"
  | "chinese_traditional"
  | "japanese"
  | "korean"
  | "portuguese"
  | "russian"
  | "italian"
  | "dutch"
  | "swedish"
  | "norwegian"
  | "danish"
  | "finnish"
  | "polish"
  | "czech"
  | "hungarian"
  | "romanian"
  | "bulgarian"
  | "greek"
  | "turkish"
  | "hebrew"
  | "persian"
  | "bengali"
  | "tamil"
  | "telugu"
  | "marathi"
  | "gujarati"
  | "punjabi"
  | "thai"
  | "vietnamese"
  | "indonesian"
  | "malay"
  | "tagalog"
  | "swahili"
  | "amharic"
  | "yoruba"
  | "hausa"
  | "igbo"
  | "zulu"
  | "afrikaans"
  | "ukrainian"
  | "croatian"
  | "serbian"
  | "slovenian"
  | "slovak"
  | "lithuanian"
  | "latvian"
  | "estonian"
  | "maltese"
  | "icelandic"
  | "irish"
  | "welsh"
  | "basque"
  | "catalan"
  | "galician"
  | "portuguese_br"
  | "spanish_mx"
  | "spanish_ar"
  | "french_ca"
  | "english_uk"
  | "english_au"
  | "english_in"

const languages = [
  { value: "english", label: "English", flag: "🇺🇸" },
  { value: "spanish", label: "Spanish", flag: "🇪🇸" },
  { value: "german", label: "German", flag: "🇩🇪" },
  { value: "french", label: "French", flag: "🇫🇷" },
  { value: "hindi", label: "Hindi", flag: "🇮🇳" },
  { value: "urdu", label: "Urdu", flag: "🇵🇰" },
  { value: "arabic", label: "Arabic", flag: "🇸🇦" },
  { value: "chinese", label: "Chinese (Simplified)", flag: "🇨🇳" },
  { value: "chinese_traditional", label: "Chinese (Traditional)", flag: "🇹🇼" },
  { value: "japanese", label: "Japanese", flag: "🇯🇵" },
  { value: "korean", label: "Korean", flag: "🇰🇷" },
  { value: "portuguese", label: "Portuguese", flag: "🇵🇹" },
  { value: "russian", label: "Russian", flag: "🇷🇺" },
  { value: "italian", label: "Italian", flag: "🇮🇹" },
  { value: "dutch", label: "Dutch", flag: "🇳🇱" },
  { value: "swedish", label: "Swedish", flag: "🇸🇪" },
  { value: "norwegian", label: "Norwegian", flag: "🇳🇴" },
  { value: "danish", label: "Danish", flag: "🇩🇰" },
  { value: "finnish", label: "Finnish", flag: "🇫🇮" },
  { value: "polish", label: "Polish", flag: "🇵🇱" },
  { value: "czech", label: "Czech", flag: "🇨🇿" },
  { value: "hungarian", label: "Hungarian", flag: "🇭🇺" },
  { value: "romanian", label: "Romanian", flag: "🇷🇴" },
  { value: "bulgarian", label: "Bulgarian", flag: "🇧🇬" },
  { value: "greek", label: "Greek", flag: "🇬🇷" },
  { value: "turkish", label: "Turkish", flag: "🇹🇷" },
  { value: "hebrew", label: "Hebrew", flag: "🇮🇱" },
  { value: "persian", label: "Persian (Farsi)", flag: "🇮🇷" },
  { value: "bengali", label: "Bengali", flag: "🇧🇩" },
  { value: "tamil", label: "Tamil", flag: "🇱🇰" },
  { value: "telugu", label: "Telugu", flag: "🇮🇳" },
  { value: "marathi", label: "Marathi", flag: "🇮🇳" },
  { value: "gujarati", label: "Gujarati", flag: "🇮🇳" },
  { value: "punjabi", label: "Punjabi", flag: "🇮🇳" },
  { value: "thai", label: "Thai", flag: "🇹🇭" },
  { value: "vietnamese", label: "Vietnamese", flag: "🇻🇳" },
  { value: "indonesian", label: "Indonesian", flag: "🇮🇩" },
  { value: "malay", label: "Malay", flag: "🇲🇾" },
  { value: "tagalog", label: "Tagalog (Filipino)", flag: "🇵🇭" },
  { value: "swahili", label: "Swahili", flag: "🇰🇪" },
  { value: "amharic", label: "Amharic", flag: "🇪🇹" },
  { value: "yoruba", label: "Yoruba", flag: "🇳🇬" },
  { value: "hausa", label: "Hausa", flag: "🇳🇬" },
  { value: "igbo", label: "Igbo", flag: "🇳🇬" },
  { value: "zulu", label: "Zulu", flag: "🇿🇦" },
  { value: "afrikaans", label: "Afrikaans", flag: "🇿🇦" },
  { value: "ukrainian", label: "Ukrainian", flag: "🇺🇦" },
  { value: "croatian", label: "Croatian", flag: "🇭🇷" },
  { value: "serbian", label: "Serbian", flag: "🇷🇸" },
  { value: "slovenian", label: "Slovenian", flag: "🇸🇮" },
  { value: "slovak", label: "Slovak", flag: "🇸🇰" },
  { value: "lithuanian", label: "Lithuanian", flag: "🇱🇹" },
  { value: "latvian", label: "Latvian", flag: "🇱🇻" },
  { value: "estonian", label: "Estonian", flag: "🇪🇪" },
  { value: "maltese", label: "Maltese", flag: "🇲🇹" },
  { value: "icelandic", label: "Icelandic", flag: "🇮🇸" },
  { value: "irish", label: "Irish (Gaelic)", flag: "🇮🇪" },
  { value: "welsh", label: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { value: "basque", label: "Basque", flag: "🇪🇸" },
  { value: "catalan", label: "Catalan", flag: "🇪🇸" },
  { value: "galician", label: "Galician", flag: "🇪🇸" },
  { value: "portuguese_br", label: "Portuguese (Brazilian)", flag: "🇧🇷" },
  { value: "spanish_mx", label: "Spanish (Mexican)", flag: "🇲🇽" },
  { value: "spanish_ar", label: "Spanish (Argentinian)", flag: "🇦🇷" },
  { value: "french_ca", label: "French (Canadian)", flag: "🇨🇦" },
  { value: "english_uk", label: "English (British)", flag: "🇬🇧" },
  { value: "english_au", label: "English (Australian)", flag: "🇦🇺" },
  { value: "english_in", label: "English (Indian)", flag: "🇮🇳" },
]

interface LanguageSelectorProps {
  language: Language
  setLanguage: (language: Language) => void
}

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const selectedLanguage = languages.find((lang) => lang.value === language)

  const filteredLanguages = languages.filter((lang) => lang.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Content Language</span>
      </div>

      <div className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-full justify-between border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg">{selectedLanguage?.flag}</span>
            <span>{selectedLanguage?.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">No language found.</div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value as Language)
                      setOpen(false)
                      setSearchTerm("")
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                      language === lang.value && "bg-blue-50 text-blue-600",
                    )}
                  >
                    <span className="mr-2 text-lg">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.label}</span>
                    {language === lang.value && <Check className="h-4 w-4" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setOpen(false)
            setSearchTerm("")
          }}
        />
      )}
    </div>
  )
}
