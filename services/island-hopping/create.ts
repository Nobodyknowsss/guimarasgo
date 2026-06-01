import { prisma } from "@/lib/prisma";
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
      photos: input.photos as never,
      created_at: now,
      updated_at: now,
    },
  });

  return IslandHoppingListingSchema.parse(row);
}
