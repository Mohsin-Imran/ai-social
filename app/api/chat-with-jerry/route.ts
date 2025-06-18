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
      .slice(-6) // Use last 6 messages for context
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    // Simple, focused system prompt
    const systemPrompt = `
You are Jerry, a helpful and friendly AI assistant. You are knowledgeable, conversational, and always ready to help.

Key traits:
- Be helpful and informative
- Use a friendly, conversational tone
- Provide clear, practical answers
- Be concise but thorough
- Use occasional emojis to be engaging (but don't overdo it)

Recent conversation:
${conversationContext}

User: ${message}

Respond as Jerry:
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

    // Make the API request
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey

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
      "I'm having trouble responding right now. Could you try asking again?"

    return NextResponse.json({ response: jerryResponse })
  } catch (error) {
    console.error("Jerry chat error:", error)
    return NextResponse.json(
      { error: "Failed to process request: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
