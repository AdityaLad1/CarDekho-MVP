# CarDekho MVP: AI-Powered Smart Shortlister

**Live URL:** [https://car-dekho-mvp.vercel.app/](https://car-dekho-mvp.vercel.app/)
**GitHub:** [https://github.com/AdityaLad1/CarDekho-MVP](https://github.com/AdityaLad1/CarDekho-MVP)
**Video Walkthrough:** [https://drive.google.com/drive/folders/1OaLtJdCAoUKzOqQW9um-WDOKHR-XEWLR?usp=sharing](https://drive.google.com/drive/folders/1OaLtJdCAoUKzOqQW9um-WDOKHR-XEWLR?usp=sharing)

---

## 1. What did you build and why? What did you deliberately cut?

**What I built:** A "One-Shot" Smart Shortlister. A user inputs their unstructured lifestyle needs (budget, family size, commute, fuel preference) and the system uses an LLM to output a strict, JSON-structured array of exactly 3 car recommendations — complete with ranked reasoning, key specs, price range, and honest trade-offs. Buyers can then ask unlimited follow-up questions in a chat format, with the AI retaining full conversation context for the session.

**Why:** The brief asked to move a user from "confused" to "confident." A generic open-ended chatbot leaks context and produces vague answers. A structured, card-based UI with a dedicated reasoning field ("Why this car fits you") gives immediate, digestible value. It mirrors how a good car salesperson actually works — they listen, then give you a shortlist, not a wall of options.

**What I deliberately cut:**
- **Cross-session persistence / database** — no login, no saved sessions. Everything lives in React state. Refresh = reset. This cut 2+ hours of setup with zero UX loss for an MVP. A static `cars.json` of 50 Indian market cars serves as the catalog.
- **Images** — would have required a CDN mapping layer or scraping pipeline. Not worth it for a recommendation engine where specs and reasoning are the value.
- **RAG / vector search** — ideally you'd embed the catalog and retrieve only the top N relevant cars per query. For 50 cars and Gemini's 1M token context window, sending the full JSON on every request is acceptable for an MVP and eliminates retrieval complexity.
- **User auth** — irrelevant to the core value being tested.
- **Streaming** — the structured output (3 cards) is generated via `generateObject` which doesn't stream. Follow-up responses return conversational plain text using `generateText`. Kept it clean and separated.

---

## 2. What's your tech stack and why did you pick it?

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Fast setup, API routes on the backend, one-command Vercel deploy |
| Language | TypeScript 5 (strict) | Catches schema mismatches early, especially critical with Zod output validation |
| Styling | Tailwind CSS v4 | No context switching, high-speed iteration |
| Package manager | pnpm | Faster installs, cleaner lockfile |
| AI SDK | Vercel AI SDK (`ai`) + `@ai-sdk/google` | `ai` is the core SDK, `@ai-sdk/google` is the Gemini provider adapter. Inference goes directly to Google's Gemini API using my own API key — Vercel is not proxying or billing model usage |
| Structured output | Zod v4 | Schema-first approach greatly reduces frontend crashes from malformed AI output. First prompt returns validated JSON, follow-ups return plain conversational text |
| Model | `gemini-2.5-flash` | Fast inference, free-tier friendly, sufficient for structured recommendation generation in an MVP context |
| Deployment | Vercel | Zero-config for Next.js |

**Key architecture decision:** Two separate Next.js 16 API routes — `/api/recommend` (first prompt: `generateObject` + Zod schema → structured 3-card JSON) and `/api/followup` (follow-ups: `generateText` → plain conversational text). This keeps structured and conversational concerns cleanly separated.

> **Note on `generateObject`:** The current implementation uses `generateObject` for structured recommendation generation. While newer SDK abstractions are emerging around structured generation, `generateObject` was intentionally kept because it remains stable, well-documented, and ideal for a time-boxed MVP where schema reliability and development speed mattered more than adopting the newest abstraction layer.

**Chat history strategy:** The AI receives the full conversation history on every call. The first assistant message stored in history is the stringified JSON of the 3 recommendations — so every follow-up has exact context of what was recommended and why.

---

## Request Flow

### Initial Recommendation
1. User enters their requirements in natural language
2. Frontend sends request to `/api/recommend`
3. Backend constructs prompt using: system prompt + full `cars.json` + chat history + user message
4. Gemini generates structured output via `generateObject`
5. Zod validates the response schema
6. Frontend renders 3 recommendation cards

### Follow-Up Questions
1. User asks a refinement or comparison question
2. Frontend sends request to `/api/followup`
3. Full conversation history is passed back to Gemini
4. Gemini responds conversationally via `generateText`
5. Frontend renders plain chat bubbles below the recommendation cards

### Session Behavior
- No database, no auth, no persistence
- All state lives in React state (`useState`)
- Refresh = reset. New Chat button = reset.

---

## 3. What did you delegate to AI tools vs. do manually?

**Delegated to AI (The Typist):**
- Full architecture planning — API route separation, state shape, chat history strategy, Zod schema design — all planned before a single line of code was written
- Component scaffolding and Tailwind boilerplate (Car Cards, loading skeletons, chat bubbles)
- The `cars.json` catalog — 50 Indian market cars with real specs, pricing, pros/cons, sourced and formatted via AI
- System prompt engineering
- Zod schema definition for structured output

**Done manually / reviewed and corrected (The Architect):**
- **SDK decision** — AI initially suggested `@google/generative-ai` (Google's native SDK). I corrected to `@ai-sdk/google` (Vercel AI SDK wrapper) because it handles `generateObject` + Zod natively with no compatibility shims needed
- **Schema naming fix** — caught a `price_lakh` vs `price_range` mismatch between the car catalog and the Zod output schema during planning, before it became a runtime bug
- **Cut anti-hallucination validation middleware** — AI (ChatGPT) suggested adding a `validateRecommendations.ts` layer. Valid for production, unnecessary overhead for 50 cars with a grounded system prompt
- **Cut `useChat` hook** — for a structured-first flow (JSON cards → plain chat), `useState` + plain `fetch` is cleaner and more debuggable than forcing `useChat`'s streaming assumptions onto a `generateObject` response
- **Rejected over-engineering** — AI suggested context compression, `lib/ai/` subfolder architecture, and multi-model fallback. All cut to protect the timebox

**Where AI helped most:** Architecture planning speed. The entire project — folder structure, data flow, API contracts, Zod schema, system prompt — was locked before coding started. That's where the real hours were saved.

**Where AI got in the way:** AI naturally tries to build bloated conversational chatbots with complex middleware. Had to repeatedly rein in suggestions to enforce a lean, stateless-first architecture.

---

## 4. If you had another 4 hours, what would you add?

1. **MongoDB Atlas Vector Search (RAG pipeline)** — embed the car catalog, run cosine similarity on the buyer's query, pass only the top 10 relevant cars to the LLM instead of all 50. Cuts token cost by ~70% and improves recommendation precision at scale
2. **Cloudinary image pipeline** — inject Cloudinary-hosted car image URLs into the MongoDB payload for edge-optimized delivery. Currently cut because static asset mapping would eat 45 minutes
3. **Semantic caching with Redis** — cache identical or near-identical queries (e.g., "SUV under 20 lakhs") to serve instant responses without hitting the LLM API. Near-zero latency for common buyer profiles
4. **Comparison mode** — let the buyer select 2 of the 3 recommended cars and get a structured side-by-side breakdown on the dimensions they care about
5. **Streaming first response** — progressively reveal the 3 cards as they generate instead of waiting for the full `generateObject` response

---

## Run Instructions

```bash
# Clone the repo
git clone https://github.com/AdityaLad1/CarDekho-MVP.git
cd CarDekho-MVP

# Install dependencies
pnpm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

Get a free Gemini API key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)