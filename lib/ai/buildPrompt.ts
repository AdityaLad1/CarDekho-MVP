import cars from "../cars.json"
import { ChatMessage } from "@/types"
import { systemPrompt } from "../systemPrompt"

export function buildPrompt(
  userMessage: string,
  chatHistory: ChatMessage[]
) {
  return `
${systemPrompt}

CAR CATALOG:
${JSON.stringify(cars, null, 2)}

CHAT HISTORY:
${JSON.stringify(chatHistory, null, 2)}

LATEST USER MESSAGE:
${userMessage}
`
}