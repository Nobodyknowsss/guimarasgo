import { prisma } from "@/lib/prisma";
import {
  DayTourListingSchema,
  type DayTourListing,
} from "@/types/day-tours";

// Services return the raw row: `photos` carries storage PATHS. Map them to public
// URLs at the read edge with withPublicPhotos (see lib/supabase/storage).
export async function getDayTourListings(): Promise<DayTourListing[]> {
  const rows = await prisma.day_tour_listings.findMany({
    orderBy: { created_at: "asc" },
  });

  return rows.map((row) => DayTourListingSchema.parse(row));
}

export async function getDayTourListingById(
  id: string,
): Promise<DayTourListing | null> {
  const row = await prisma.day_tour_listings.findUnique({ where: { id } });

  if (!row) return null;

  return DayTourListingSchema.parse(row);
}
