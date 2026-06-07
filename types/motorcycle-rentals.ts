import { z } from "zod";

// Photos are stored as an array of Supabase Storage *paths* (relative to the
// motorcycle-rentals bucket). Services return paths; map them to public URLs at
// the read edge via lib/supabase/storage.withPublicPhotos.
//
// `specs` is a flattened list of "Label: Value" strings (e.g. "Engine: 125cc").
export const MotorcycleRentalListingSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  location: z.string(),
  title: z.string(),
  photos: z.array(z.string()),
  price: z.number().int().positive(),
  price_unit: z.string(),
  max_per_day: z.number().int().positive(),
  description: z.string(),
  specs: z.array(z.string()),
  highlights: z.array(z.string()),
  included: z.array(z.string()),
  delivery: z.string(),
  rental_terms: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CreateMotorcycleRentalListingSchema =
  MotorcycleRentalListingSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

export type MotorcycleRentalListing = z.infer<
  typeof MotorcycleRentalListingSchema
>;
export type CreateMotorcycleRentalListing = z.infer<
  typeof CreateMotorcycleRentalListingSchema
>;
