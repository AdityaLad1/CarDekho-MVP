import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { buildPrompt } from "@/lib/ai/buildPrompt"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { userMessage, chatHistory } = body

    const prompt = buildPrompt(userMessage, chatHistory)

    const result = await generateText({
      model: google("gemini-3.1-flash-lite"),
      temperature: 0.7,
      prompt,
    })

    return Response.json({
      text: result.text,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error: "Failed to generate follow-up response",
      },
      {
        status: 500,
      }
    )
  }
}