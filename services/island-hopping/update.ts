import { prisma } from "@/lib/prisma";
import { publicPhotoUrl } from "@/lib/supabase/storage";
import {
  IslandHoppingListingSchema,
  type CreateIslandHoppingListing,
  type IslandHoppingListing,
} from "@/types/island-hopping";

export async function updateIslandHoppingListing(
  id: string,
  input: CreateIslandHoppingListing,
): Promise<IslandHoppingListing | null> {
  const exists = await prisma.island_hopping_listings.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) return null;

  const row = await prisma.island_hopping_listings.update({
    where: { id },
    data: {
      ...input,
      updated_at: new Date(),
    },
  });

  const listing = IslandHoppingListingSchema.parse(row);
  // Stored as paths; return displayable URLs.
  return { ...listing, photos: listing.photos.map(publicPhotoUrl) };
}
