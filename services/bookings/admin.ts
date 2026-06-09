import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/bookings/categories";
import type {
  AdminBooking,
  AdminCustomer,
  BookingStatus,
} from "@/lib/admin/data";

// Read-side queries for the admin dashboard. These run inside admin server
// components (which gate on requireAdmin first). They map Prisma rows to the
// presentational shapes the admin UI already expects.

// Prisma's enum is uppercase; the UI uses lowercase status strings.
const statusToUi: Record<string, BookingStatus> = {
  CONFIRMED: "confirmed",
  PENDING: "pending",
  CANCELLED: "cancelled",
};

function customerName(
  firstName: string | null,
  lastName: string | null,
  email: string,
): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || email;
}

/**
 * Every booking, newest first. Pass a limit for the overview's recent list.
 */
export async function getAdminBookings(limit?: number): Promise<AdminBooking[]> {
  const rows = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    customerName: customerName(
      row.user.firstName,
      row.user.lastName,
      row.user.email,
    ),
    customerEmail: row.user.email,
    categoryLabel: categoryLabel(row.category),
    tourTitle: row.tourTitle,
    date: row.date.toISOString(),
    partySize: row.partySize,
    status: statusToUi[row.status] ?? "pending",
    feePaid: row.feePaid,
    createdAt: row.createdAt.toISOString(),
  }));
}

export interface AdminBookingStats {
  totalBookings: number;
  confirmed: number;
  pending: number;
  feeRevenue: number;
}

/** Headline counts for the overview cards. */
export async function getAdminBookingStats(): Promise<AdminBookingStats> {
  const [totalBookings, confirmed, pending, feeAgg] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({
      _sum: { fee: true },
      where: { feePaid: true },
    }),
  ]);

  return {
    totalBookings,
    confirmed,
    pending,
    feeRevenue: feeAgg._sum.fee ?? 0,
  };
}

/** Every signed-up customer with their booking count, newest first. */
export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      fbLink: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    firstName: u.firstName ?? "",
    lastName: u.lastName ?? "",
    email: u.email,
    phone: u.phone ?? "",
    facebook: u.fbLink ?? undefined,
    bookings: u._count.bookings,
    joinedAt: u.createdAt.toISOString(),
  }));
}
