"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Pencil, Trash2 } from "lucide-react";

import { badgeStyles } from "@/lib/tours/shared";
import {
  adminListings,
  tourCategoryOptions,
  type AdminListing,
} from "@/lib/admin/data";

export function ToursManager() {
  // Local-only: delete removes from the in-memory list and resets on reload.
  const [listings, setListings] = useState<AdminListing[]>(adminListings);

  function remove(slug: string) {
    setListings((prev) => prev.filter((l) => l.slug !== slug));
  }

  return (
    <div className="space-y-6">
      {tourCategoryOptions.map((category) => {
        const items = listings.filter((l) => l.category === category.slug);
        return (
          <section
            key={category.slug}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {category.label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "listing" : "listings"}
              </span>
            </div>

            {items.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground">
                No listings in this category.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
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
                        className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
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
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[listing.badge]}`}
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
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground/70 ring-1 ring-border transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => remove(listing.slug)}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-border transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
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
            )}
          </section>
        );
      })}
    </div>
  );
}
