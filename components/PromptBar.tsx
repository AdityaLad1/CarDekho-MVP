"use client"

import { FormEvent, useState } from "react"

type Props = {
  onSubmit: (message: string) => Promise<void>
  isLoading: boolean
}

export default function PromptBar({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!input.trim()) return

    await onSubmit(input)
    setInput("")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-black p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your ideal car..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-white text-black px-6 rounded-xl font-medium disabled:opacity-50"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  )
}