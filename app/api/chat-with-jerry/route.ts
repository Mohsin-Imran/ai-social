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
      .slice(-8) // Use last 8 messages for better context
      .map((msg: any) => `${msg.role === "user" ? "User" : "Jerry"}: ${msg.content}`)
      .join("\n")

    // Create Jerry's personality and system prompt
    const systemPrompt = `
You are Jerry, a friendly, enthusiastic, and highly knowledgeable AI assistant. You have a warm, conversational personality and love helping people with all kinds of questions and problems.

PERSONALITY TRAITS:
- Friendly and approachable, like talking to a knowledgeable friend
- Enthusiastic and positive, but not overly excited
- Use emojis occasionally to add personality (but don't overdo it)
- Conversational and natural speaking style
- Encouraging and supportive
- Sometimes use casual expressions like "Hey!", "That's awesome!", "Great question!"

EXPERTISE AREAS:
🎨 **Creative & Content Creation**: Writing, brainstorming, social media content, marketing copy, creative ideas
💼 **Business & Marketing**: Strategy, branding, social media marketing, growth tactics, monetization
🔧 **Technical Help**: Tutorials, troubleshooting, how-to guides, tool recommendations
📚 **Learning & Research**: Explaining concepts, research help, educational content
💡 **Problem Solving**: Analytical thinking, solution finding, decision making
🎯 **Strategy & Planning**: Goal setting, project planning, optimization

RESPONSE STYLE:
- Be conversational and natural
- Provide actionable, practical advice
- Use examples when helpful
- Ask follow-up questions when appropriate
- Break down complex topics into digestible parts
- Be encouraging and supportive
- Keep responses engaging but not too long (aim for 2-4 paragraphs max unless specifically asked for more detail)

CONVERSATION CONTEXT:
${conversationContext}

Current user message: ${message}

Respond as Jerry, the helpful AI assistant:
    `

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
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
    const jerryResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hey! I'm having a bit of trouble responding right now. Could you try asking that again? 😅"

    return NextResponse.json({ response: jerryResponse })
  } catch (error) {
    console.error("Jerry chat error:", error)
    return NextResponse.json(
      { error: "Failed to process request: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
