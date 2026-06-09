"use client";

import { useState } from "react";
import Link from "next/link";
import { Sailboat, Sun, Bike, MapPin, ArrowRight, type LucideIcon } from "lucide-react";

import { TourCover } from "@/components/tours/tour-cover";

// Unified browse view across the three (otherwise independent) tour types. The
// per-service data/services stay separate — this only combines their results for
// display and lets the customer filter by type. Items arrive pre-serialized from
// the server page (photo paths already mapped to public URLs).
export type ServiceKey = "ISLAND_HOPPING" | "DAY_TOUR" | "MOTORCYCLE_RENTAL";

export type TourItem = {
  id: string;
  service: ServiceKey;
  title: string;
  location: string;
  description: string;
  price: number;
  priceUnit: string;
  /** Public photo URL, or null for the icon placeholder. */
  photo: string | null;
};

const serviceMeta: Record<
  ServiceKey,
  { label: string; icon: LucideIcon; slug: string }
> = {
  ISLAND_HOPPING: { label: "Island Hopping", icon: Sailboat, slug: "island-hopping" },
  DAY_TOUR: { label: "Day Tours", icon: Sun, slug: "day-tours" },
  MOTORCYCLE_RENTAL: { label: "Motorcycle Rentals", icon: Bike, slug: "motorcycle-rentals" },
};

type TabKey = "ALL" | ServiceKey;

const tabOrder: TabKey[] = [
  "ALL",
  "ISLAND_HOPPING",
  "DAY_TOUR",
  "MOTORCYCLE_RENTAL",
];

function tabLabel(key: TabKey): string {
  return key === "ALL" ? "All Tours" : serviceMeta[key].label;
}

function TourCard({ item }: { item: TourItem }) {
  const meta = serviceMeta[item.service];

  return (
    <Link
      href={`/tours/${meta.slug}/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <TourCover photo={item.photo} title={item.title} icon={meta.icon} />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <meta.icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <span className="text-xs text-muted-foreground">from</span>
            <p className="text-xl font-bold text-foreground">
              ₱{item.price.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {item.priceUnit}
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            More Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ToursExplorer({ tours }: { tours: TourItem[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");

  const counts: Record<TabKey, number> = {
    ALL: tours.length,
    ISLAND_HOPPING: tours.filter((t) => t.service === "ISLAND_HOPPING").length,
    DAY_TOUR: tours.filter((t) => t.service === "DAY_TOUR").length,
    MOTORCYCLE_RENTAL: tours.filter((t) => t.service === "MOTORCYCLE_RENTAL")
      .length,
  };

  const filtered =
    activeTab === "ALL"
      ? tours
      : tours.filter((t) => t.service === activeTab);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabOrder.map((key) => {
          const active = key === activeTab;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground"
              }`}
            >
              {tabLabel(key)}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-muted-foreground">
          Nothing listed here just yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <TourCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
