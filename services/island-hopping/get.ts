import { prisma } from "@/lib/prisma";
import {
  IslandHoppingListingSchema,
  type IslandHoppingListing,
} from "@/types/island-hopping";

export async function getIslandHoppingListings(): Promise<
  IslandHoppingListing[]
> {
  const rows = await prisma.island_hopping_listings.findMany({
    orderBy: { created_at: "asc" },
  });

  return rows.map((row) =>
    IslandHoppingListingSchema.parse(row),
  );
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
