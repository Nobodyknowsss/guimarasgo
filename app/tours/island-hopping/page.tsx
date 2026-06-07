import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { TourCover } from "@/components/tours/tour-cover";
import { SectionLoading } from "@/components/tours/section-loading";
import { islandHoppingMeta } from "@/lib/tours/island-hopping";
import { getIslandHoppingListings } from "@/services/island-hopping/get";
import { ISLAND_HOPPING_BUCKET, publicPhotoUrl } from "@/lib/supabase/storage";

export const metadata: Metadata = {
  title: `${islandHoppingMeta.label} — GuimarasGo`,
  description: islandHoppingMeta.intro,
};

const Icon = islandHoppingMeta.icon;

async function Listings() {
  await connection();
  const listings = await getIslandHoppingListings();

  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-muted-foreground">
        No trips are listed just yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {listings.map((tour) => {
        const cover = tour.photos[0]
          ? publicPhotoUrl(ISLAND_HOPPING_BUCKET, tour.photos[0])
          : null;
        return (
          <Link
            key={tour.id}
            href={`/tours/island-hopping/${tour.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <TourCover photo={cover} title={tour.title} icon={Icon} />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {tour.location}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {tour.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tour.description}
              </p>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">from</span>
                  <p className="text-xl font-bold text-foreground">
                    ₱{tour.price.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / {tour.price_unit}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {tour.duration ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {tour.duration}
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

export default function IslandHoppingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-muted/30 pt-24 pb-12 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                {islandHoppingMeta.label}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {islandHoppingMeta.title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              {islandHoppingMeta.intro}
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
