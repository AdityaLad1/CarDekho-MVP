"use client"

import { useState } from "react"

import CarCard from "../components/CarCard"
import ChatBubble from "../components/ChatBubble"
import GuidanceHints from "../components/GuidanceHints"
import PromptBar from "../components/PromptBar"

import { RecommendationResponse } from "../lib/schema"
import { ChatMessage, DisplayMessage } from "../types"

export default function Home() {
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null)

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const [messages, setMessages] = useState<DisplayMessage[]>([])

  const [hasRecommended, setHasRecommended] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(userMessage: string) {
    try {
      setIsLoading(true)

      if (!hasRecommended) {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage,
            chatHistory,
          }),
        })

        const data: RecommendationResponse = await response.json()

        setRecommendations(data)

        setHasRecommended(true)

        setChatHistory([
          {
            role: "user",
            content: userMessage,
          },
          {
            role: "assistant",
            content: JSON.stringify(data),
          },
        ])

        return
      }

      const updatedMessages: DisplayMessage[] = [
        ...messages,
        {
          role: "user",
          content: userMessage,
        },
      ]

      setMessages(updatedMessages)

      const response = await fetch("/api/followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage,
          chatHistory,
        }),
      })

      const data = await response.json()

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.text,
        },
      ])

      setChatHistory([
        ...chatHistory,
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "assistant",
          content: data.text,
        },
      ])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleNewChat() {
    setRecommendations(null)
    setChatHistory([])
    setMessages([])
    setHasRecommended(false)
  }

  return (
    <main className="min-h-screen pb-40">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">CarDekho-MVP</h1>

        <button
          onClick={handleNewChat}
          className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl"
        >
          New Chat
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {!hasRecommended && <GuidanceHints />}

        {recommendations && (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.recommendations.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {recommendations.assumptions && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h2 className="font-semibold mb-2">Assumptions</h2>

                <p className="text-zinc-300 text-sm">
                  {recommendations.assumptions}
                </p>
              </div>
            )}

            <div className="space-y-4 mt-10">
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <PromptBar
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  )
}