import { z } from "zod";

export const PhotoSchema = z.object({
  url: z.string(),
  publicId: z.string(),
});

export const IslandHoppingListingSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  location: z.string(),
  title: z.string(),
  photos: z.array(PhotoSchema),
  price: z.number().int().positive(),
  price_unit: z.string(),
  max_per_day: z.number().int().positive(),
  description: z.string(),
  highlights: z.array(z.string()),
  islands: z.array(z.string()),
  included: z.array(z.string()),
  meeting_point: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Photo = z.infer<typeof PhotoSchema>;
export type IslandHoppingListing = z.infer<typeof IslandHoppingListingSchema>;