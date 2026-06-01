import { prisma } from "@/lib/prisma";

export async function deleteIslandHoppingListing(id: string): Promise<boolean> {
  const result = await prisma.island_hopping_listings.deleteMany({
    where: { id },
  });

  return result.count > 0;
}
