import { prisma } from "@/lib/prisma";
import {
  MotorcycleRentalListingSchema,
  type MotorcycleRentalListing,
} from "@/types/motorcycle-rentals";

// Services return the raw row: `photos` carries storage PATHS. Map them to public
// URLs at the read edge with withPublicPhotos (see lib/supabase/storage).
export async function getMotorcycleRentalListings(): Promise<
  MotorcycleRentalListing[]
> {
  const rows = await prisma.motorcycle_rental_listings.findMany({
    orderBy: { created_at: "asc" },
  });

  return rows.map((row) => MotorcycleRentalListingSchema.parse(row));
}

export async function getMotorcycleRentalListingById(
  id: string,
): Promise<MotorcycleRentalListing | null> {
  const row = await prisma.motorcycle_rental_listings.findUnique({
    where: { id },
  });

  if (!row) return null;

  return MotorcycleRentalListingSchema.parse(row);
}
