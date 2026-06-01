export default function GuidanceHints() {
  const hints = [
    "What is your daily running (km)?",
    "How big is your family?",
    "Do you prefer Petrol, Diesel, Electric, or Hybrid?",
    "What is your budget (in Lakhs)?",
    "Do you want a Hatchback, Sedan, SUV, or MUV?",
    "City driving or highway driving?",
    "First-time buyer or upgrading?",
  ]

  return (
    <div className="max-w-3xl mx-auto mt-20 space-y-4">
      <h1 className="text-3xl font-bold text-center">
        Find Your Perfect Car
      </h1>

      <p className="text-zinc-400 text-center">
        Describe your needs naturally and get AI-powered recommendations.
      </p>

      <div className="grid gap-3 mt-10">
        {hints.map((hint) => (
          <div
            key={hint}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300"
          >
            {hint}
          </div>
        ))}
      </div>
    </div>
  )
}