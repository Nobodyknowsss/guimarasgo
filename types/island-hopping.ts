import { z } from "zod";

// Photos are stored as an array of Supabase Storage *paths* (relative to the
// island-hopping bucket), e.g. "abc123.jpg". On read, the services map each path
// to its public URL via lib/supabase/storage.publicPhotoUrl — so this same
// `photos` field carries paths going in (create/update) and URLs coming out (get).
export const IslandHoppingListingSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  location: z.string(),
  title: z.string(),
  photos: z.array(z.string()),
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

export const CreateIslandHoppingListingSchema = IslandHoppingListingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type IslandHoppingListing = z.infer<typeof IslandHoppingListingSchema>;
export type CreateIslandHoppingListing = z.infer<typeof CreateIslandHoppingListingSchema>;
