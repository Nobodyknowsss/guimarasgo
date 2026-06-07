import { prisma } from "@/lib/prisma";
import {
  MotorcycleRentalListingSchema,
  type CreateMotorcycleRentalListing,
  type MotorcycleRentalListing,
} from "@/types/motorcycle-rentals";

export async function updateMotorcycleRentalListing(
  id: string,
  input: CreateMotorcycleRentalListing,
): Promise<MotorcycleRentalListing | null> {
  const exists = await prisma.motorcycle_rental_listings.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) return null;

  const row = await prisma.motorcycle_rental_listings.update({
    where: { id },
    data: {
      ...input,
      updated_at: new Date(),
    },
  });

  // Returns the raw row (photos are storage paths).
  return MotorcycleRentalListingSchema.parse(row);
}
