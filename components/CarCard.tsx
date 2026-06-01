import { RecommendationResponse } from "@/lib/schema"

type Car = RecommendationResponse["recommendations"][0]

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-sm text-zinc-400">#{car.rank} Recommendation</p>

        <h2 className="text-2xl font-bold mt-1">
          {car.brand} {car.model}
        </h2>

        <p className="text-zinc-400">{car.variant}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-zinc-500">Fuel</p>
          <p>{car.fuel_type}</p>
        </div>

        <div>
          <p className="text-zinc-500">Body Type</p>
          <p>{car.body_type}</p>
        </div>

        <div>
          <p className="text-zinc-500">Price</p>
          <p>
            ₹{car.price_lakh.min}L - ₹{car.price_lakh.max}L
          </p>
        </div>

        <div>
          <p className="text-zinc-500">Power</p>
          <p>{car.key_specs.power_bhp} bhp</p>
        </div>

        <div>
          <p className="text-zinc-500">Transmission</p>
          <p>{car.key_specs.transmission}</p>
        </div>

        <div>
          <p className="text-zinc-500">Seats</p>
          <p>{car.key_specs.seating_capacity}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Why Recommended</h3>
        <p className="text-zinc-300 text-sm">
          {car.why_recommended}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Pros</h3>
        <ul className="list-disc list-inside text-sm text-zinc-300">
          {car.pros.map((pro) => (
            <li key={pro}>{pro}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Cons</h3>
        <ul className="list-disc list-inside text-sm text-zinc-300">
          {car.cons.map((con) => (
            <li key={con}>{con}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
