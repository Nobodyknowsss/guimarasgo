import { prisma } from "@/lib/prisma";
import type { UpdateBookingStatus } from "@/types/bookings";

// UI status (lowercase) → Prisma enum (uppercase).
const statusToDb = {
  confirmed: "CONFIRMED",
  pending: "PENDING",
  cancelled: "CANCELLED",
} as const;

/**
 * Updates a booking's status. Returns false when no booking matched the id
 * (so the route can answer 404); updateMany avoids a throw on missing rows.
 */
export async function updateBookingStatus(
  id: string,
  status: UpdateBookingStatus["status"],
): Promise<boolean> {
  const result = await prisma.booking.updateMany({
    where: { id },
    data: { status: statusToDb[status] },
  });

  return result.count > 0;
}
