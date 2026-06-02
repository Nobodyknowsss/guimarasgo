import { prisma } from "@/lib/prisma";
import { publicPhotoUrl } from "@/lib/supabase/storage";
import {
  IslandHoppingListingSchema,
  type IslandHoppingListing,
} from "@/types/island-hopping";

// Stored photos are storage paths; callers want displayable URLs, so map on read.
function withPhotoUrls(listing: IslandHoppingListing): IslandHoppingListing {
  return { ...listing, photos: listing.photos.map(publicPhotoUrl) };
}

export async function getIslandHoppingListings(): Promise<
  IslandHoppingListing[]
> {
  const rows = await prisma.island_hopping_listings.findMany({
    orderBy: { created_at: "asc" },
  });

  return rows.map((row) => withPhotoUrls(IslandHoppingListingSchema.parse(row)));
}

export async function getIslandHoppingListingById(
  id: string,
): Promise<IslandHoppingListing | null> {
  const row = await prisma.island_hopping_listings.findUnique({
    where: { id },
  });

  if (!row) return null;

  return withPhotoUrls(IslandHoppingListingSchema.parse(row));
}
