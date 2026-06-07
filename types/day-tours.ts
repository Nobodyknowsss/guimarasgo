import { z } from "zod";

// Photos are stored as an array of Supabase Storage *paths* (relative to the
// day-tours bucket). Services return paths; map them to public URLs at the read
// edge via lib/supabase/storage.withPublicPhotos.
export const DayTourListingSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  location: z.string(),
  title: z.string(),
  photos: z.array(z.string()),
  price: z.number().int().positive(),
  price_unit: z.string(),
  max_per_day: z.number().int().positive(),
  description: z.string(),
  duration: z.string(),
  highlights: z.array(z.string()),
  stops: z.array(z.string()),
  included: z.array(z.string()),
  pickup: z.string(),
  good_to_know: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CreateDayTourListingSchema = DayTourListingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type DayTourListing = z.infer<typeof DayTourListingSchema>;
export type CreateDayTourListing = z.infer<typeof CreateDayTourListingSchema>;
