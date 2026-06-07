import { prisma } from "@/lib/prisma";
import {
  MotorcycleRentalListingSchema,
  type CreateMotorcycleRentalListing,
  type MotorcycleRentalListing,
} from "@/types/motorcycle-rentals";

export async function createMotorcycleRentalListing(
  input: CreateMotorcycleRentalListing,
): Promise<MotorcycleRentalListing> {
  const now = new Date();

  const row = await prisma.motorcycle_rental_listings.create({
    data: {
      id: crypto.randomUUID(),
      ...input,
      created_at: now,
      updated_at: now,
    },
  });

  // Returns the raw row (photos are storage paths).
  return MotorcycleRentalListingSchema.parse(row);
}
