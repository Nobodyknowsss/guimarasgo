import { prisma } from "@/lib/prisma";
import {
  DayTourListingSchema,
  type CreateDayTourListing,
  type DayTourListing,
} from "@/types/day-tours";

export async function updateDayTourListing(
  id: string,
  input: CreateDayTourListing,
): Promise<DayTourListing | null> {
  const exists = await prisma.day_tour_listings.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) return null;

  const row = await prisma.day_tour_listings.update({
    where: { id },
    data: {
      ...input,
      updated_at: new Date(),
    },
  });

  // Returns the raw row (photos are storage paths).
  return DayTourListingSchema.parse(row);
}
