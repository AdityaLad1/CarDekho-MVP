import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { ResponseSchema } from "@/lib/schema"
import { buildPrompt } from "@/lib/ai/buildPrompt"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { userMessage, chatHistory } = body

    const prompt = buildPrompt(userMessage, chatHistory)

    const result = await generateObject({
      model: google("gemini-3.1-flash-lite"),
      schema: ResponseSchema,
      temperature: 0.4,
      prompt,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error: "Failed to generate recommendations",
      },
      {
        status: 500,
      }
    )
  }
}