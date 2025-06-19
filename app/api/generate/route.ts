import { type NextRequest, NextResponse } from "next/server"

// Default API key
const DEFAULT_API_KEY = "AIzaSyAKFaE1aDR-_zf_NxuKFFsCTvG_2bD4V3g"

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const mediaFile = formData.get("media") as File
    const mediaType = formData.get("mediaType") as string
    const platform = formData.get("platform") as string
    const tone = formData.get("tone") as string
    const lineCountStr = formData.get("lineCount") as string
    const language = (formData.get("language") as string) || "english"
    const customPrompt = (formData.get("customPrompt") as string) || ""
    const lineCount = lineCountStr ? Number.parseInt(lineCountStr) : 10 // Default to 10 lines if not specified

    if (!mediaFile) {
      return NextResponse.json({ error: "No media file provided" }, { status: 400 })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (mediaFile.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Use environment variable or default API key
    const apiKey = process.env.GOOGLE_API_KEY || DEFAULT_API_KEY

    // Convert media to base64
    const mediaBytes = await mediaFile.arrayBuffer()
    const base64Media = Buffer.from(mediaBytes).toString("base64")

    // Create prompt based on platform, tone, and media type
    const platformInstructions = getPlatformInstructions(platform)
    const toneInstructions = getToneInstructions(tone)
    const mediaInstructions = getMediaInstructions(mediaType)
    const lengthInstructions = getLengthInstructions(lineCount)
    const languageInstructions = getLanguageInstructions(language)
    const customInstructions = getCustomInstructions(customPrompt)

    const prompt = `
      You are a professional social media content creator.
      
      Analyze this ${mediaType} and create engaging ${platform} content based on what you see.
      
      ${mediaInstructions}
      
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
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mediaFile.type,
                data: base64Media,
              },
            },
          ],
        },
      ],
      safety_settings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }

    // Implement retry logic with exponential backoff
    let retries = 0
    let delay = INITIAL_RETRY_DELAY
    let lastError = null

    while (retries <= MAX_RETRIES) {
      try {
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

        if (response.ok) {
          const data = await response.json()
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated"
          return NextResponse.json({ content: generatedText })
        }

        const errorData = await response.json()

        // Check if the error is due to model overload
        if (
          response.status === 429 ||
          response.status === 503 ||
          (errorData.error?.message && errorData.error.message.includes("overloaded"))
        ) {
          // This is a retryable error
          lastError = errorData
          retries++

          if (retries <= MAX_RETRIES) {
            // Wait before retrying with exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 2 // Exponential backoff
            continue
          }
        }

        // For non-retryable errors or if we've exhausted retries
        return NextResponse.json(
          { error: "Error from Gemini API: " + (errorData.error?.message || "Unknown error") },
          { status: response.status },
        )
      } catch (error) {
        // Network errors or other exceptions
        lastError = error
        retries++

        if (retries <= MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= 2
          continue
        }

        throw error
      }
    }

    // If we've exhausted all retries
    return NextResponse.json(
      {
        error: "Gemini API is currently overloaded. Please try again later.",
        details: lastError instanceof Error ? lastError.message : JSON.stringify(lastError),
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

function getMediaInstructions(mediaType: string): string {
  switch (mediaType) {
    case "video":
      return "Analyze the video content, including any motion, scenes, people, objects, text, or activities shown. Consider the video's mood, setting, and any story it tells."
    case "image":
      return "Analyze the image content, including people, objects, scenery, colors, mood, and any text visible in the image."
    default:
      return "Analyze the media content and describe what you see."
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
      return "Create engaging social media content based on this media."
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
    return "Create a single-line post that captures the essence of the media."
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

  return `Create an extremely detailed and comprehensive post with exactly ${lineCount} lines of content. Use a combination of paragraphs, bullet points, numbered lists, and other formatting to reach exactly ${lineCount} lines. This should be an in-depth analysis or story based on the media.`
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
    
    Make sure to follow these custom instructions while still maintaining the platform-appropriate format and including the media analysis.
  `
}
