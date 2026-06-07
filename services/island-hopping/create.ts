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
      created_at: now,
      updated_at: now,
    },
  });

  // Returns the raw row (photos are storage paths).
  return IslandHoppingListingSchema.parse(row);
}
