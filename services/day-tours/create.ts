import { prisma } from "@/lib/prisma";
import {
  DayTourListingSchema,
  type CreateDayTourListing,
  type DayTourListing,
} from "@/types/day-tours";

export async function createDayTourListing(
  input: CreateDayTourListing,
): Promise<DayTourListing> {
  const now = new Date();

  const row = await prisma.day_tour_listings.create({
    data: {
      id: crypto.randomUUID(),
      ...input,
      created_at: now,
      updated_at: now,
    },
  });

  // Returns the raw row (photos are storage paths).
  return DayTourListingSchema.parse(row);
}
