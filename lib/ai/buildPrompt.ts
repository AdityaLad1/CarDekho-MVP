import cars from "../cars.json"
import { ChatMessage } from "@/types"
import { systemPrompt } from "../systemPrompt"

export function buildPrompt(
  userMessage: string,
  chatHistory: ChatMessage[],
  isFollowUp: boolean = false
) {
  return `
${systemPrompt}

${isFollowUp ? `
IMPORTANT:
- This is a follow-up conversation.
- DO NOT return JSON.
- Respond like a human car advisor.
- Keep response conversational and concise.
- Use normal plain text only.
` : `
IMPORTANT:
- Return structured JSON only.
`}

CAR CATALOG:
${JSON.stringify(cars, null, 2)}

CHAT HISTORY:
${JSON.stringify(chatHistory, null, 2)}

LATEST USER MESSAGE:
${userMessage}
`
}