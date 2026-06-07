import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { MapPin, Gauge, ArrowLeft, ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { TourCover } from "@/components/tours/tour-cover";
import { SectionLoading } from "@/components/tours/section-loading";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";
import { getMotorcycleRentalListings } from "@/services/motorcycle-rentals/get";
import {
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";

export const metadata: Metadata = {
  title: `${motorcycleRentalsMeta.label} — GuimarasGo`,
  description: motorcycleRentalsMeta.intro,
};

const Icon = motorcycleRentalsMeta.icon;

// Specs are stored flattened as "Label: Value"; show just the value in the chip.
function specValue(spec: string): string {
  const i = spec.indexOf(":");
  return i === -1 ? spec : spec.slice(i + 1).trim();
}

async function Listings() {
  await connection();
  const listings = await getMotorcycleRentalListings();

  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-muted-foreground">
        No bikes are listed just yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {listings.map((rental) => {
        const cover = rental.photos[0]
          ? publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, rental.photos[0])
          : null;
        return (
          <Link
            key={rental.id}
            href={`/tours/motorcycle-rentals/${rental.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <TourCover photo={cover} title={rental.title} icon={Icon} />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {rental.location}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {rental.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {rental.description}
              </p>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">from</span>
                  <p className="text-xl font-bold text-foreground">
                    ₱{rental.price.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / {rental.price_unit}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {rental.specs[0] ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Gauge className="h-3.5 w-3.5" />
                      {specValue(rental.specs[0])}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    More Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function MotorcycleRentalsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-muted/30 pt-24 pb-12 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#tours"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all categories
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                {motorcycleRentalsMeta.label}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {motorcycleRentalsMeta.title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              {motorcycleRentalsMeta.intro}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoading />}>
              <Listings />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
