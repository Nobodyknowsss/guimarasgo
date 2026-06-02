"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Pencil, Trash2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { badgeStyles } from "@/lib/tours/shared";
import {
  adminListings,
  tourCategoryOptions,
  type AdminListing,
} from "@/lib/admin/data";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

export function ToursManager() {
  // Local-only: delete removes from the in-memory list and resets on reload.
  const [listings, setListings] = useState<AdminListing[]>(adminListings);
  const [activeCategory, setActiveCategory] = useState<string>(
    tourCategoryOptions[0].slug,
  );

  function remove(slug: string) {
    setListings((prev) => prev.filter((l) => l.slug !== slug));
  }

  const items = listings.filter((l) => l.category === activeCategory);
  const activeLabel =
    tourCategoryOptions.find((c) => c.slug === activeCategory)?.label ?? "";

  return (
    <div className="space-y-5">
      {/* Tour-type toggle: switches which single category is shown. */}
      <div
        role="tablist"
        aria-label="Tour type"
        className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted/60 p-1"
      >
        {tourCategoryOptions.map((category) => {
          const Icon = category.icon;
          const isActive = category.slug === activeCategory;
          const count = listings.filter(
            (l) => l.category === category.slug,
          ).length;
          return (
            <button
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:flex-row sm:gap-2 sm:text-sm",
                focusRing,
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-center leading-tight">{category.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums sm:text-xs",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active category header. */}
      <h2 className="text-sm font-semibold text-foreground">
        {activeLabel}
        <span className="ml-2 font-normal text-muted-foreground">
          {items.length} {items.length === 1 ? "listing" : "listings"}
        </span>
      </h2>

      {items.length === 0 ? (
        <EmptyState label={activeLabel} />
      ) : (
        <>
          {/* Mobile / tablet: stacked cards (no horizontal scroll). */}
          <div className="grid gap-3 md:hidden">
            {items.map((listing) => (
              <ListingCard
                key={listing.slug}
                listing={listing}
                onDelete={remove}
              />
            ))}
          </div>

          {/* Desktop: dense table. */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Badge</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((listing) => (
                  <tr
                    key={listing.slug}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {listing.title}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      ₱{listing.price.toLocaleString()}
                      <span className="text-xs"> / {listing.priceUnit}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {listing.rating}
                        <span className="text-xs">({listing.reviews})</span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {listing.badge ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            badgeStyles[listing.badge],
                          )}
                        >
                          {listing.badge}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/tours/${listing.slug}/edit`}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground/70 ring-1 ring-border transition-colors hover:bg-muted hover:text-foreground",
                            focusRing,
                          )}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(listing.slug)}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-border transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10",
                            focusRing,
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ListingCard({
  listing,
  onDelete,
}: {
  listing: AdminListing;
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            ₱{listing.price.toLocaleString()}
            <span className="text-xs"> / {listing.priceUnit}</span>
          </p>
        </div>
        {listing.badge ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              badgeStyles[listing.badge],
            )}
          >
            {listing.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {listing.rating}
          <span className="text-xs">({listing.reviews})</span>
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>Max {listing.maxPerDay}/day</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/tours/${listing.slug}/edit`}
          className={cn(
            "inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-foreground/80 ring-1 ring-border transition-colors hover:bg-muted hover:text-foreground",
            focusRing,
          )}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(listing.slug)}
          aria-label={`Delete ${listing.title}`}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium text-rose-600 ring-1 ring-border transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10",
            focusRing,
          )}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        No {label.toLowerCase()} listings yet.
      </p>
      <Link
        href="/admin/tours/new"
        className={cn(
          "mt-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          focusRing,
        )}
      >
        <Plus className="h-4 w-4" />
        Add a tour
      </Link>
    </div>
  );
}
