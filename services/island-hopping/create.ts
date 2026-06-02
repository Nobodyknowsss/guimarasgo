import { prisma } from "@/lib/prisma";
import { publicPhotoUrl } from "@/lib/supabase/storage";
import {
  IslandHoppingListingSchema,
  type CreateIslandHoppingListing,
  type IslandHoppingListing,
} from "@/types/island-hopping";

export async function createIslandHoppingListing(
  input: CreateIslandHoppingListing,
): Promise<IslandHoppingListing> {
  const now = new Date();

  const row = await prisma.island_hopping_listings.create({
    data: {
      id: crypto.randomUUID(),
      ...input,
      created_at: now,
      updated_at: now,
    },
  });

  const listing = IslandHoppingListingSchema.parse(row);
  // Stored as paths; return displayable URLs.
  return { ...listing, photos: listing.photos.map(publicPhotoUrl) };
}
