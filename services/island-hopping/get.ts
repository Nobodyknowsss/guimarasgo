import { prisma } from "@/lib/prisma";
import {
  IslandHoppingListingSchema,
  type IslandHoppingListing,
} from "@/types/island-hopping";

// Services return the raw row: `photos` carries storage PATHS. Map them to public
// URLs at the read edge with withPublicPhotos (see lib/supabase/storage).
export async function getIslandHoppingListings(): Promise<
  IslandHoppingListing[]
> {
  const rows = await prisma.island_hopping_listings.findMany({
    orderBy: { created_at: "asc" },
  });

  return rows.map((row) => IslandHoppingListingSchema.parse(row));
}

export async function getIslandHoppingListingById(
  id: string,
): Promise<IslandHoppingListing | null> {
  const row = await prisma.island_hopping_listings.findUnique({
    where: { id },
  });

  if (!row) return null;

  return IslandHoppingListingSchema.parse(row);
}
