import { type NextRequest, NextResponse } from "next/server"

// Default API key
const DEFAULT_API_KEY = "AIzaSyB8ZE3ZiN-Tl72Xc_LxvO_fyIiR_2z4p2Q"

export async function POST(request: NextRequest) {
  try {
    const { text, platform, tone, lineCount = 10, language = "english", customPrompt = "" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Use environment variable or default API key
    const apiKey = process.env.GOOGLE_API_KEY || DEFAULT_API_KEY

    // Create prompt based on platform and tone
    const platformInstructions = getPlatformInstructions(platform)
    const toneInstructions = getToneInstructions(tone)
    const lengthInstructions = getLengthInstructions(lineCount)
    const languageInstructions = getLanguageInstructions(language)
    const customInstructions = getCustomInstructions(customPrompt)

    const prompt = `
      You are a professional social media content creator.
      
      Create engaging ${platform} content based on the following text:
      
      "${text}"
      
      ${platformInstructions}
      
      ${toneInstructions}
      
      ${lengthInstructions}
      
      ${languageInstructions}
      
      ${customInstructions}
      
      Include relevant hashtags where appropriate.
      
      Focus on creating content that will drive engagement and shares.
    `

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }

    // Prepare the request to Google's Generative AI API
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey

    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: "Error from Gemini API: " + (errorData.error?.message || "Unknown error") },
        { status: response.status },
      )
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated"

    return NextResponse.json({ content: generatedText })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

function getPlatformInstructions(platform: string): string {
  switch (platform) {
    case "instagram":
      return "Create a captivating Instagram caption. Keep it engaging but not too long (max 2 paragraphs). Include 5-7 relevant hashtags at the end."
    case "twitter":
      return "Create a concise Twitter/X post. Keep it under 280 characters including hashtags. Be punchy and direct."
    case "facebook":
      return "Create an engaging Facebook post. You can be more detailed than Twitter but still conversational. Include 2-3 hashtags if relevant."
    case "linkedin":
      return "Create a professional LinkedIn post. Focus on business value, insights, or professional development. Use a more formal tone and include 2-3 relevant hashtags."
    default:
      return "Create engaging social media content based on this text."
  }
}

function getToneInstructions(tone: string): string {
  switch (tone) {
    case "professional":
      return "Use a professional, authoritative tone. Be informative and precise. Avoid slang or overly casual language."
    case "casual":
      return "Use a casual, conversational tone. Write as if you're talking to a friend. Be relatable and authentic."
    case "humorous":
      return "Use a humorous, light-hearted tone. Include witty observations or jokes where appropriate. Keep it fun and entertaining."
    case "inspirational":
      return "Use an inspirational, motivational tone. Focus on positive messaging, growth, and encouragement. Include an uplifting message or call to action."
    default:
      return "Use a balanced, engaging tone appropriate for social media."
  }
}

function getLengthInstructions(lineCount: number): string {
  if (lineCount <= 0) {
    return "Create a concise post with about 5-10 lines of content."
  }

  if (lineCount === 1) {
    return "Create a single-line post that captures the essence of the text."
  }

  if (lineCount <= 5) {
    return `Create a very concise post with exactly ${lineCount} lines of content. Each line should be a separate paragraph.`
  }

  if (lineCount <= 20) {
    return `Create a post with exactly ${lineCount} lines of content. Each line should be a separate paragraph or point.`
  }

  if (lineCount <= 100) {
    return `Create a detailed post with exactly ${lineCount} lines of content. Structure it with clear paragraphs, bullet points, or numbered lists to reach exactly ${lineCount} lines.`
  }

  return `Create an extremely detailed and comprehensive post with exactly ${lineCount} lines of content. Use a combination of paragraphs, bullet points, numbered lists, and other formatting to reach exactly ${lineCount} lines. This should be an in-depth analysis or story based on the text.`
}

function getLanguageInstructions(language: string): string {
  if (!language || language === "english") {
    return "Write the content in English."
  }

  // Handle regional variants
  const languageMap: { [key: string]: string } = {
    spanish: "Spanish",
    spanish_mx: "Mexican Spanish with Mexican cultural references and expressions",
    spanish_ar: "Argentinian Spanish with Argentinian cultural references and expressions",
    german: "German",
    french: "French",
    french_ca: "Canadian French (Québécois) with Canadian cultural references",
    hindi: "Hindi",
    urdu: "Urdu",
    arabic: "Arabic",
    chinese: "Simplified Chinese (Mandarin)",
    chinese_traditional: "Traditional Chinese",
    japanese: "Japanese",
    korean: "Korean",
    portuguese: "Portuguese",
    portuguese_br: "Brazilian Portuguese with Brazilian cultural references and expressions",
    russian: "Russian",
    italian: "Italian",
    dutch: "Dutch",
    swedish: "Swedish",
    norwegian: "Norwegian",
    danish: "Danish",
    finnish: "Finnish",
    polish: "Polish",
    czech: "Czech",
    hungarian: "Hungarian",
    romanian: "Romanian",
    bulgarian: "Bulgarian",
    greek: "Greek",
    turkish: "Turkish",
    hebrew: "Hebrew",
    persian: "Persian (Farsi)",
    bengali: "Bengali",
    tamil: "Tamil",
    telugu: "Telugu",
    marathi: "Marathi",
    gujarati: "Gujarati",
    punjabi: "Punjabi",
    thai: "Thai",
    vietnamese: "Vietnamese",
    indonesian: "Indonesian",
    malay: "Malay",
    tagalog: "Tagalog (Filipino)",
    swahili: "Swahili",
    amharic: "Amharic",
    yoruba: "Yoruba",
    hausa: "Hausa",
    igbo: "Igbo",
    zulu: "Zulu",
    afrikaans: "Afrikaans",
    ukrainian: "Ukrainian",
    croatian: "Croatian",
    serbian: "Serbian",
    slovenian: "Slovenian",
    slovak: "Slovak",
    lithuanian: "Lithuanian",
    latvian: "Latvian",
    estonian: "Estonian",
    maltese: "Maltese",
    icelandic: "Icelandic",
    irish: "Irish (Gaelic)",
    welsh: "Welsh",
    basque: "Basque",
    catalan: "Catalan",
    galician: "Galician",
    english_uk: "British English with British cultural references and expressions",
    english_au: "Australian English with Australian cultural references and expressions",
    english_in: "Indian English with Indian cultural references and expressions",
  }

  const targetLanguage = languageMap[language] || language

  return `Write the content entirely in ${targetLanguage}. Use natural expressions, idioms, and cultural references appropriate for native speakers of this language. Do not include any English text except for brand names, hashtags, or technical terms that are commonly used in ${targetLanguage}. Make sure the tone and style feel authentic to native speakers of this language.`
}

function getCustomInstructions(customPrompt: string): string {
  if (!customPrompt || customPrompt.trim() === "") {
    return ""
  }

  return `
    IMPORTANT: The user has provided specific instructions for the content. Please prioritize and incorporate these custom requirements:
    
    "${customPrompt}"
    
    Make sure to follow these custom instructions while still maintaining the platform-appropriate format.
  `
}
