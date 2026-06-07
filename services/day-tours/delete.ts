import { prisma } from "@/lib/prisma";

export async function deleteDayTourListing(id: string): Promise<boolean> {
  const result = await prisma.day_tour_listings.deleteMany({ where: { id } });

  return result.count > 0;
}
