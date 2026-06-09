import { prisma } from "@/lib/prisma";

// A customer's own bookings, newest tour date first. Returns raw Booking rows;
// the /bookings page joins listing details (location, price) at the read edge.
export async function getBookingsByUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}
