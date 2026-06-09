import { Suspense } from "react";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { createClient } from "@/lib/supabase/server";
import { getBookingsByUser } from "@/services/bookings/get";
import { getIslandHoppingListings } from "@/services/island-hopping/get";
import { getDayTourListings } from "@/services/day-tours/get";
import { getMotorcycleRentalListings } from "@/services/motorcycle-rentals/get";
import {
  ISLAND_HOPPING_BUCKET,
  DAY_TOURS_BUCKET,
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";
import {
  BookingsView,
  type Booking,
  type NewestListing,
  type ServiceKey,
} from "./bookings-view";

const categoryToService: Record<string, ServiceKey> = {
  "island-hopping": "ISLAND_HOPPING",
  "day-tours": "DAY_TOUR",
  "motorcycle-rentals": "MOTORCYCLE_RENTAL",
};

// Listing details we still need at read time but don't snapshot on the booking
// (location for display; price + unit to show the balance due on arrival).
type ListingInfo = { location: string; price: number; priceUnit: string };

/** Today's date in the Philippines (UTC+8) as yyyy-mm-dd. */
function phToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(
    new Date(),
  );
}

export default function BookingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30 pt-24 pb-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<BookingsFallback />}>
            <BookingsLoader />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

// Fetches every listing across the three services once, returning the 3 newest
// (for the empty state) plus a lookup of details we need to render a booking's
// location and balance. Each service stores photo *paths*, so map covers to public
// URLs at the read edge.
async function loadListings(): Promise<{
  newest: NewestListing[];
  infoById: Map<string, ListingInfo>;
}> {
  const [island, day, moto] = await Promise.all([
    getIslandHoppingListings(),
    getDayTourListings(),
    getMotorcycleRentalListings(),
  ]);

  const combined = [
    ...island.map((l) => ({
      created_at: l.created_at,
      listing: {
        id: l.id,
        service: "ISLAND_HOPPING" as const,
        title: l.title,
        location: l.location,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0]
          ? publicPhotoUrl(ISLAND_HOPPING_BUCKET, l.photos[0])
          : null,
      } satisfies NewestListing,
    })),
    ...day.map((l) => ({
      created_at: l.created_at,
      listing: {
        id: l.id,
        service: "DAY_TOUR" as const,
        title: l.title,
        location: l.location,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0] ? publicPhotoUrl(DAY_TOURS_BUCKET, l.photos[0]) : null,
      } satisfies NewestListing,
    })),
    ...moto.map((l) => ({
      created_at: l.created_at,
      listing: {
        id: l.id,
        service: "MOTORCYCLE_RENTAL" as const,
        title: l.title,
        location: l.location,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0]
          ? publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, l.photos[0])
          : null,
      } satisfies NewestListing,
    })),
  ];

  const infoById = new Map<string, ListingInfo>(
    combined.map((row) => [
      row.listing.id,
      {
        location: row.listing.location,
        price: row.listing.price,
        priceUnit: row.listing.priceUnit,
      },
    ]),
  );

  const newest = combined
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 3)
    .map((row) => row.listing);

  return { newest, infoById };
}

async function BookingsLoader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/bookings");
  }

  const [{ newest, infoById }, rows] = await Promise.all([
    loadListings(),
    getBookingsByUser(user.id),
  ]);

  const today = phToday();

  const bookings: Booking[] = rows.map((row) => {
    const service = categoryToService[row.category] ?? "ISLAND_HOPPING";
    const info = infoById.get(row.offeringId);
    const dateStr = row.date.toISOString().slice(0, 10);

    // Balance paid on arrival: the full service price, multiplied by party size
    // only for per-person pricing (island hopping). Group/day pricing is flat.
    const balance = info
      ? info.priceUnit === "person"
        ? info.price * row.partySize
        : info.price
      : 0;

    return {
      id: row.id,
      reference: row.reference,
      service,
      offeringId: row.offeringId,
      title: row.tourTitle,
      location: info?.location ?? "",
      dateLabel: new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-PH", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      partySize: row.partySize,
      status: dateStr >= today ? "UPCOMING" : "COMPLETED",
      balance,
    };
  });

  return <BookingsView bookings={bookings} newest={newest} />;
}

function BookingsFallback() {
  return (
    <>
      <div className="mt-6 mb-6">
        <div className="h-9 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-6 h-10 w-full max-w-md animate-pulse rounded-full bg-muted" />
      <div className="h-64 w-full animate-pulse rounded-3xl bg-muted" />
    </>
  );
}
