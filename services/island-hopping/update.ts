import { prisma } from "@/lib/prisma";
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
      photos: input.photos as never,
      updated_at: new Date(),
    },
  });

  return IslandHoppingListingSchema.parse(row);
}
