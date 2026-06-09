import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { TourCover } from "@/components/tours/tour-cover";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getIslandHoppingListingById } from "@/services/island-hopping/get";
import { getDayTourListingById } from "@/services/day-tours/get";
import { getMotorcycleRentalListingById } from "@/services/motorcycle-rentals/get";
import { islandHoppingMeta } from "@/lib/tours/island-hopping";
import { dayToursMeta } from "@/lib/tours/day-tours";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";
import {
  ISLAND_HOPPING_BUCKET,
  DAY_TOURS_BUCKET,
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";
import { BookingForm } from "./booking-form";

type SearchParams = Promise<{ category?: string; offering?: string }>;

export default function BookPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30 pt-24 pb-16">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<BookFallback />}>
            <BookFlow searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

// Maps a reserve link (?category=&offering=) to a small summary of what's being
// booked. Returns null when the category is unknown or the listing is missing.
async function loadOffering(category?: string, offering?: string) {
  if (!category || !offering) return null;

  switch (category) {
    case islandHoppingMeta.slug: {
      const row = await getIslandHoppingListingById(offering);
      if (!row) return null;
      return {
        meta: islandHoppingMeta,
        title: row.title,
        location: row.location,
        price: row.price,
        priceUnit: row.price_unit,
        photo: row.photos[0]
          ? publicPhotoUrl(ISLAND_HOPPING_BUCKET, row.photos[0])
          : null,
      };
    }
    case dayToursMeta.slug: {
      const row = await getDayTourListingById(offering);
      if (!row) return null;
      return {
        meta: dayToursMeta,
        title: row.title,
        location: row.location,
        price: row.price,
        priceUnit: row.price_unit,
        photo: row.photos[0]
          ? publicPhotoUrl(DAY_TOURS_BUCKET, row.photos[0])
          : null,
      };
    }
    case motorcycleRentalsMeta.slug: {
      const row = await getMotorcycleRentalListingById(offering);
      if (!row) return null;
      return {
        meta: motorcycleRentalsMeta,
        title: row.title,
        location: row.location,
        price: row.price,
        priceUnit: row.price_unit,
        photo: row.photos[0]
          ? publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, row.photos[0])
          : null,
      };
    }
    default:
      return null;
  }
}

async function BookFlow({ searchParams }: { searchParams: SearchParams }) {
  const { category, offering } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (offering) qs.set("offering", offering);
    const next = `/book${qs.toString() ? `?${qs.toString()}` : ""}`;
    redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  }

  const offeringSummary = await loadOffering(category, offering);

  if (!offeringSummary) {
    return <OfferingNotFound />;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      fbLink: true,
    },
  });

  const initial = {
    email: dbUser?.email ?? user.email ?? "",
    firstName: dbUser?.firstName ?? "",
    lastName: dbUser?.lastName ?? "",
    phone: dbUser?.phone ?? "",
    fbLink: dbUser?.fbLink ?? "",
  };

  const { meta, title, location, price, priceUnit, photo } = offeringSummary;

  return (
    <div className="mt-2 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reserve your slot
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick your date, confirm your details, and lock in your slot.
        </p>
      </div>

      {/* What you're reserving */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex gap-4 p-4">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
            <TourCover photo={photo} title={title} icon={meta.icon} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {meta.label}
            </span>
            <h2 className="mt-0.5 truncate text-base font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </p>
          </div>
        </div>

        <dl className="divide-y divide-border border-t border-border text-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-muted-foreground">Service price</dt>
            <dd className="font-medium text-foreground">
              ₱{price.toLocaleString()}{" "}
              <span className="text-muted-foreground">/ {priceUnit}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                (paid on arrival)
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="font-medium text-foreground">Reservation fee</dt>
            <dd className="font-semibold text-foreground">
              ₱{meta.reservationFee.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <BookingForm
        initial={initial}
        offering={{
          category: category!,
          offeringId: offering!,
          title,
          categoryLabel: meta.label,
          fee: meta.reservationFee,
          price,
          priceUnit,
        }}
      />
    </div>
  );
}

function OfferingNotFound() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        We couldn&apos;t find that listing
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The tour or rental you were trying to reserve isn&apos;t available. Browse
        our offerings to pick another.
      </p>
      <div className="mt-6">
        <Link
          href="/#tours"
          className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse tours
        </Link>
      </div>
    </div>
  );
}

function BookFallback() {
  return (
    <div className="mt-2 space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-44 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-5 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-9 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
