"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, ImageOff, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { tourCategoryOptions } from "@/lib/admin/data";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

export interface AdminTourListing {
  id: string;
  /** Category slug, e.g. "day-tours". */
  category: string;
  categoryLabel: string;
  title: string;
  price: number;
  priceUnit: string;
  maxPerDay: number;
  /** First photo URL, or null when the listing has no photos. */
  cover: string | null;
}

export function ToursManager({ initial }: { initial: AdminTourListing[] }) {
  const [listings, setListings] = useState<AdminTourListing[]>(initial);
  const [activeCategory, setActiveCategory] = useState<string>(
    tourCategoryOptions[0].slug,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-sync when the server page re-fetches (after a create/edit/delete refresh).
  useEffect(() => setListings(initial), [initial]);

  async function remove(item: AdminTourListing) {
    if (
      !window.confirm(
        `Delete "${item.title}"? This permanently removes the listing.`,
      )
    ) {
      return;
    }

    setDeletingId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/${item.category}/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to delete listing.");
        setDeletingId(null);
        return;
      }
      setListings((prev) => prev.filter((l) => l.id !== item.id));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
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

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <EmptyState label={activeLabel} />
      ) : (
        <>
          {/* Mobile / tablet: stacked cards (no horizontal scroll). */}
          <div className="grid gap-3 md:hidden">
            {items.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDelete={remove}
                deleting={deletingId === listing.id}
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
                  <th className="px-5 py-3 font-medium">Max / day</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb cover={listing.cover} title={listing.title} />
                        <span className="font-medium text-foreground">
                          {listing.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      ₱{listing.price.toLocaleString()}
                      <span className="text-xs"> / {listing.priceUnit}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {listing.maxPerDay}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/tours/${listing.category}/${listing.id}/edit`}
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
                          onClick={() => remove(listing)}
                          disabled={deletingId === listing.id}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-border transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10",
                            focusRing,
                          )}
                        >
                          {deletingId === listing.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
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

function Thumb({ cover, title }: { cover: string | null; title: string }) {
  return cover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover}
      alt={title}
      className="h-9 w-9 shrink-0 rounded-md object-cover"
    />
  ) : (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
      <ImageOff className="h-4 w-4" />
    </span>
  );
}

function ListingCard({
  listing,
  onDelete,
  deleting,
}: {
  listing: AdminTourListing;
  onDelete: (listing: AdminTourListing) => void;
  deleting: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Thumb cover={listing.cover} title={listing.title} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            ₱{listing.price.toLocaleString()}
            <span className="text-xs"> / {listing.priceUnit}</span>
            <span className="text-muted-foreground/40"> · </span>
            Max {listing.maxPerDay}/day
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/tours/${listing.category}/${listing.id}/edit`}
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
          onClick={() => onDelete(listing)}
          disabled={deleting}
          aria-label={`Delete ${listing.title}`}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium text-rose-600 ring-1 ring-border transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10",
            focusRing,
          )}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
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
