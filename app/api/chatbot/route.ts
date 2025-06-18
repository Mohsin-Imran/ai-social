import { type NextRequest, NextResponse } from "next/server"

// Default API key
const DEFAULT_API_KEY = "AIzaSyB8ZE3ZiN-Tl72Xc_LxvO_fyIiR_2z4p2Q"

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Use environment variable or default API key
    const apiKey = process.env.GOOGLE_API_KEY || DEFAULT_API_KEY

    // Create conversation context from history
    const conversationContext = history
      .slice(-5) // Only use last 5 messages for context
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    // Create a comprehensive system prompt for the AI assistant
    const systemPrompt = `
You are a helpful AI assistant integrated into a social media content creation app. You can help users with:

1. SOCIAL MEDIA STRATEGY:
   - Content planning and scheduling
   - Platform-specific best practices
   - Engagement strategies
   - Hashtag research and optimization
   - Audience growth tactics

2. CONTENT CREATION:
   - Writing tips and techniques
   - Creative brainstorming
   - Content ideas and themes
   - Copywriting advice
   - Visual content suggestions

3. MARKETING & BUSINESS:
   - Brand building advice
   - Marketing strategies
   - Analytics interpretation
   - Competitor analysis
   - ROI optimization

4. TECHNICAL HELP:
   - App usage questions
   - Feature explanations
   - Troubleshooting
   - Best practices for tools

5. GENERAL ASSISTANCE:
   - Problem-solving
   - Creative writing
   - Research help
   - Brainstorming sessions
   - Educational content

GUIDELINES:
- Be conversational, friendly, and helpful
- Provide actionable, practical advice
- Use emojis occasionally to make responses engaging
- Keep responses concise but comprehensive
- Ask follow-up questions when helpful
- Provide examples when relevant
- Be encouraging and supportive

CONVERSATION CONTEXT:
${conversationContext}

Current user message: ${message}

Respond as a helpful AI assistant:
    `

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
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
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json(
      { error: "Failed to process request: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
