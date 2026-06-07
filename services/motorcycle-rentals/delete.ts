import { prisma } from "@/lib/prisma";

export async function deleteMotorcycleRentalListing(
  id: string,
): Promise<boolean> {
  const result = await prisma.motorcycle_rental_listings.deleteMany({
    where: { id },
  });

  return result.count > 0;
}
