import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  ToursManager,
  type AdminTourListing,
} from "@/components/admin/tours-manager";
import { SectionLoading } from "@/components/tours/section-loading";
import { getIslandHoppingListings } from "@/services/island-hopping/get";
import { getDayTourListings } from "@/services/day-tours/get";
import { getMotorcycleRentalListings } from "@/services/motorcycle-rentals/get";
import {
  DAY_TOURS_BUCKET,
  ISLAND_HOPPING_BUCKET,
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";
import { islandHoppingMeta } from "@/lib/tours/island-hopping";
import { dayToursMeta } from "@/lib/tours/day-tours";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";

const cover = (bucket: string, photos: string[]): string | null =>
  photos[0] ? publicPhotoUrl(bucket, photos[0]) : null;

async function ToursData() {
  await connection();

  const [island, day, moto] = await Promise.all([
    getIslandHoppingListings(),
    getDayTourListings(),
    getMotorcycleRentalListings(),
  ]);

  const listings: AdminTourListing[] = [
    ...island.map((l) => ({
      id: l.id,
      category: islandHoppingMeta.slug,
      categoryLabel: islandHoppingMeta.label,
      title: l.title,
      price: l.price,
      priceUnit: l.price_unit,
      maxPerDay: l.max_per_day,
      cover: cover(ISLAND_HOPPING_BUCKET, l.photos),
    })),
    ...day.map((l) => ({
      id: l.id,
      category: dayToursMeta.slug,
      categoryLabel: dayToursMeta.label,
      title: l.title,
      price: l.price,
      priceUnit: l.price_unit,
      maxPerDay: l.max_per_day,
      cover: cover(DAY_TOURS_BUCKET, l.photos),
    })),
    ...moto.map((l) => ({
      id: l.id,
      category: motorcycleRentalsMeta.slug,
      categoryLabel: motorcycleRentalsMeta.label,
      title: l.title,
      price: l.price,
      priceUnit: l.price_unit,
      maxPerDay: l.max_per_day,
      cover: cover(MOTORCYCLE_RENTALS_BUCKET, l.photos),
    })),
  ];

  return <ToursManager initial={listings} />;
}

export default function AdminToursPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link
          href="/admin/tours/new"
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <Plus className="h-4 w-4" />
          Add tour
        </Link>
      </div>
      <Suspense fallback={<SectionLoading />}>
        <ToursData />
      </Suspense>
    </div>
  );
}
