import { type NextRequest, NextResponse } from "next/server"

// Default API key
const DEFAULT_API_KEY = "AIzaSyAKFaE1aDR-_zf_NxuKFFsCTvG_2bD4V3g"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Use environment variable or default API key
    const apiKey = process.env.GOOGLE_API_KEY || DEFAULT_API_KEY

    // Convert image to base64
    const imageBytes = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(imageBytes).toString("base64")

    // Create prompt for text extraction
    const prompt = `
      Extract all text visible in this image. 
      Return only the extracted text, without any additional commentary.
      If there is no text visible, respond with "No text found in the image."
    `

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image,
              },
            },
          ],
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
    const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No text found in the image."

    // Check if no text was found
    if (extractedText === "No text found in the image.") {
      return NextResponse.json({ text: "" })
    }

    return NextResponse.json({ text: extractedText })
  } catch (error) {
    console.error("Error extracting text:", error)
    return NextResponse.json(
      { error: "Failed to extract text: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
