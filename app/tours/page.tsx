import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { SectionLoading } from "@/components/tours/section-loading";
import { getIslandHoppingListings } from "@/services/island-hopping/get";
import { getDayTourListings } from "@/services/day-tours/get";
import { getMotorcycleRentalListings } from "@/services/motorcycle-rentals/get";
import {
  ISLAND_HOPPING_BUCKET,
  DAY_TOURS_BUCKET,
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";
import { ToursExplorer, type TourItem } from "./tours-explorer";

export const metadata: Metadata = {
  title: "All Tours & Rentals — GuimarasGo",
  description:
    "Browse every GuimarasGo experience — island hopping, day tours, and motorcycle rentals. Reserve a slot for ₱100 and pay the balance on arrival.",
};

// Loads every listing across the three services and flattens them into one list
// for the browse page. Each service stores photo *paths*, so the cover is mapped
// to a public URL here at the read edge. Sorted newest-first.
async function getAllTours(): Promise<TourItem[]> {
  await connection();
  const [island, day, moto] = await Promise.all([
    getIslandHoppingListings(),
    getDayTourListings(),
    getMotorcycleRentalListings(),
  ]);

  const combined = [
    ...island.map((l) => ({
      created_at: l.created_at,
      item: {
        id: l.id,
        service: "ISLAND_HOPPING" as const,
        title: l.title,
        location: l.location,
        description: l.description,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0]
          ? publicPhotoUrl(ISLAND_HOPPING_BUCKET, l.photos[0])
          : null,
      } satisfies TourItem,
    })),
    ...day.map((l) => ({
      created_at: l.created_at,
      item: {
        id: l.id,
        service: "DAY_TOUR" as const,
        title: l.title,
        location: l.location,
        description: l.description,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0] ? publicPhotoUrl(DAY_TOURS_BUCKET, l.photos[0]) : null,
      } satisfies TourItem,
    })),
    ...moto.map((l) => ({
      created_at: l.created_at,
      item: {
        id: l.id,
        service: "MOTORCYCLE_RENTAL" as const,
        title: l.title,
        location: l.location,
        description: l.description,
        price: l.price,
        priceUnit: l.price_unit,
        photo: l.photos[0]
          ? publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, l.photos[0])
          : null,
      } satisfies TourItem,
    })),
  ];

  return combined
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .map((row) => row.item);
}

async function Tours() {
  const tours = await getAllTours();
  return <ToursExplorer tours={tours} />;
}

export default function ToursPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30">
        <section className="pt-24 pb-16 sm:pt-28 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoading />}>
              <Tours />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
