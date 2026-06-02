"use client";

import { useState } from "react";
import { Star, Trash2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  adminListings,
  adminRatings,
  formatDate,
  type AdminRating,
} from "@/lib/admin/data";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
const fieldClass = cn(
  "h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
  focusRing,
);

export function RatingsManager() {
  // Local-only: additions/deletions feel live but reset on reload (no backend).
  const [ratings, setRatings] = useState<AdminRating[]>(adminRatings);
  const [tourSlug, setTourSlug] = useState(adminListings[0]?.slug ?? "");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  function addRating(e: React.FormEvent) {
    e.preventDefault();
    const listing = adminListings.find((l) => l.slug === tourSlug);
    if (!listing || !author.trim() || !comment.trim()) return;

    setRatings((prev) => [
      {
        id: crypto.randomUUID(),
        tourSlug: listing.slug,
        tourTitle: listing.title,
        categoryLabel: listing.categoryLabel,
        author: author.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setAuthor("");
    setComment("");
    setRating(5);
  }

  function remove(id: string) {
    setRatings((prev) => prev.filter((r) => r.id !== id));
  }

  const avg = ratings.length
    ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      {/* Add-rating form */}
      <form
        onSubmit={addRating}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:self-start"
      >
        <div>
          <h2 className="text-base font-semibold text-foreground">Add a rating</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Seed a review for any listing.
          </p>
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="rating-tour"
            className="text-xs font-medium text-muted-foreground"
          >
            Tour
          </label>
          <select
            id="rating-tour"
            value={tourSlug}
            onChange={(e) => setTourSlug(e.target.value)}
            className={cn(fieldClass, "cursor-pointer")}
          >
            {adminListings.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Rating</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className={cn("cursor-pointer rounded p-0.5", focusRing)}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    (hover || rating) >= n
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm tabular-nums text-muted-foreground">
              {rating}.0
            </span>
          </div>
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="rating-author"
            className="text-xs font-medium text-muted-foreground"
          >
            Reviewer name
          </label>
          <input
            id="rating-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Maria Santos"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="rating-comment"
            className="text-xs font-medium text-muted-foreground"
          >
            Review
          </label>
          <textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What did they think?"
            className={cn(
              "rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
              focusRing,
            )}
          />
        </div>

        <button
          type="submit"
          className={cn(
            "inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            focusRing,
          )}
        >
          <Plus className="h-4 w-4" />
          Add rating
        </button>
      </form>

      {/* Reviews list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Reviews
            <span className="ml-2 font-normal text-muted-foreground">
              {ratings.length}
            </span>
          </h2>
          {ratings.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {avg.toFixed(1)} avg
            </span>
          ) : null}
        </div>

        {ratings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
            No ratings yet. Add the first one.
          </div>
        ) : (
          <div className="grid gap-3">
            {ratings.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "h-3.5 w-3.5",
                            r.rating >= n
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                    <h3 className="mt-1.5 truncate text-sm font-semibold text-foreground">
                      {r.tourTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {r.categoryLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    aria-label={`Delete review by ${r.author}`}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-lg p-2 text-muted-foreground ring-1 ring-border transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400",
                      focusRing,
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-foreground/90">{r.comment}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  — {r.author} · {formatDate(r.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
