import { z } from "zod"

export const CarRecommendationSchema = z.object({
  id: z.number(),
  rank: z.number(),
  brand: z.string(),
  model: z.string(),
  variant: z.string(),
  fuel_type: z.string(),
  body_type: z.string(),

  price_lakh: z.object({
    min: z.number(),
    max: z.number(),
  }),

  key_specs: z.object({
    power_bhp: z.number(),
    transmission: z.string(),
    seating_capacity: z.number(),
    mileage_kmpl: z.number().nullable(),
    range_km: z.number().nullable(),
  }),

  why_recommended: z.string(),

  pros: z.array(z.string()).max(3),
  cons: z.array(z.string()).max(3),
})

export const ResponseSchema = z.object({
  recommendations: z.array(CarRecommendationSchema).length(3),
  assumptions: z.string().nullable(),
})

export type RecommendationResponse = z.infer<typeof ResponseSchema>