import { Suspense } from "react";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { createClient } from "@/lib/supabase/server";
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
} from "./bookings-view";

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

// Fetches the 3 most recently created listings across all three services. Each
// service stores photo *paths*, so map the cover to a public URL at the read edge.
async function getNewestListings(): Promise<NewestListing[]> {
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

  return combined
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 3)
    .map((row) => row.listing);
}

async function BookingsLoader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/bookings");
  }

  // No Booking model / Reserve flow exists yet (see CLAUDE.md), so the customer
  // has no bookings to show. Until then the view renders the empty state with the
  // 3 newest listings. Swap this for a `prisma.booking.findMany({ where: {
  // userId: user.id } })` query once the schema and Reserve flow land.
  const bookings: Booking[] = [];
  const newest = await getNewestListings();

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
