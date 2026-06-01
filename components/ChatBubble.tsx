import { DisplayMessage } from "@/types"

export default function ChatBubble({
  role,
  content,
}: DisplayMessage) {
  return (
    <div
      className={`flex ${
        role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-2xl rounded-2xl px-5 py-4
          whitespace-pre-wrap text-sm leading-7
          ${
            role === "user"
              ? "bg-white text-black"
              : "bg-zinc-900 border border-zinc-800 text-zinc-100"
          }
        `}
      >
        {content}
      </div>
    </div>
  )
}