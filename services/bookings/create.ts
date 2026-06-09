import { prisma } from "@/lib/prisma";
import { getIslandHoppingListingById } from "@/services/island-hopping/get";
import { getDayTourListingById } from "@/services/day-tours/get";
import { getMotorcycleRentalListingById } from "@/services/motorcycle-rentals/get";
import { islandHoppingMeta } from "@/lib/tours/island-hopping";
import { dayToursMeta } from "@/lib/tours/day-tours";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";
import type { CreateBooking } from "@/types/bookings";

export type CreateBookingResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

/** Today's date in the Philippines (UTC+8) as yyyy-mm-dd. */
function phToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(
    new Date(),
  );
}

// Loads the booked listing's title + reservation fee, or null if it's gone.
async function resolveOffering(category: string, offeringId: string) {
  switch (category) {
    case islandHoppingMeta.slug: {
      const row = await getIslandHoppingListingById(offeringId);
      return row
        ? { title: row.title, fee: islandHoppingMeta.reservationFee }
        : null;
    }
    case dayToursMeta.slug: {
      const row = await getDayTourListingById(offeringId);
      return row ? { title: row.title, fee: dayToursMeta.reservationFee } : null;
    }
    case motorcycleRentalsMeta.slug: {
      const row = await getMotorcycleRentalListingById(offeringId);
      return row
        ? { title: row.title, fee: motorcycleRentalsMeta.reservationFee }
        : null;
    }
    default:
      return null;
  }
}

/**
 * Creates a booking for `userId`, snapshotting the listing title + reservation
 * fee, and keeps the customer's profile in sync with the contact details they
 * submitted. Input is assumed already shape-validated (see CreateBookingSchema);
 * this layer enforces the business rules (future date, listing still exists).
 */
export async function createBooking(args: {
  userId: string;
  userEmail: string;
  input: CreateBooking;
}): Promise<CreateBookingResult> {
  const { userId, userEmail, input } = args;

  const fbLink = input.fbLink?.trim() ?? "";
  if (fbLink) {
    try {
      new URL(fbLink);
    } catch {
      return { ok: false, error: "Facebook link must be a valid URL." };
    }
  }

  const today = phToday();
  if (input.date < today) {
    return { ok: false, error: "The tour date can't be in the past." };
  }

  const offering = await resolveOffering(input.category, input.offeringId);
  if (!offering) {
    return { ok: false, error: "That listing is no longer available." };
  }

  const dateValue = new Date(`${input.date}T00:00:00.000Z`);
  const refYear = today.slice(0, 4);

  const reference = await prisma.$transaction(async (tx) => {
    // Keep the customer's profile current and ensure the user row exists so the
    // booking's FK is satisfied.
    await tx.user.upsert({
      where: { id: userId },
      update: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        fbLink: fbLink || null,
      },
      create: {
        id: userId,
        email: userEmail,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        fbLink: fbLink || null,
      },
    });

    // Sequential, human-friendly reference per year (e.g. GG-2026-0001).
    const countThisYear = await tx.booking.count({
      where: { reference: { startsWith: `GG-${refYear}-` } },
    });
    const ref = `GG-${refYear}-${String(countThisYear + 1).padStart(4, "0")}`;

    await tx.booking.create({
      data: {
        reference: ref,
        userId,
        category: input.category,
        offeringId: input.offeringId,
        tourTitle: offering.title,
        date: dateValue,
        partySize: input.partySize,
        status: "CONFIRMED",
        feePaid: false,
        fee: offering.fee,
      },
    });

    return ref;
  });

  return { ok: true, reference };
}
