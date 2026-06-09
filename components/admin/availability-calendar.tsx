"use client";

import { useMemo, useState } from "react";

import { adminListings, tourCategoryOptions } from "@/lib/admin/data";

// The bits of a booking the calendar needs to count slots per day.
export type AvailabilityBooking = {
  /** yyyy-mm-dd */
  date: string;
  categoryLabel: string;
  tourTitle: string;
  status: "confirmed" | "pending" | "cancelled";
};

// Anchored to June 2026 (the current month for this build) so the grid lines up
// with today. Real bookings are counted per day from the `bookings` prop.
const YEAR = 2026;
const MONTH = 5; // June (0-indexed)
const MONTH_LABEL = "June 2026";
const TODAY = 9;

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fieldClass =
  "h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function AvailabilityCalendar({
  bookings,
}: {
  bookings: AvailabilityBooking[];
}) {
  const [category, setCategory] = useState("all");
  const [offering, setOffering] = useState("all");

  const categoryLabel = tourCategoryOptions.find((c) => c.slug === category)?.label;

  // Offerings available for the selected category (or all of them).
  const offeringOptions = useMemo(
    () =>
      adminListings.filter((l) => category === "all" || l.category === category),
    [category],
  );

  const selectedListing = adminListings.find((l) => l.slug === offering);
  const offeringTitle = selectedListing?.title;
  // Daily cap comes from the selected offering (0 = no single cap to show).
  const cap = selectedListing?.maxPerDay ?? 0;

  function countOnDay(day: number): number {
    const key = `${YEAR}-${String(MONTH + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => {
      if (b.date !== key || b.status === "cancelled") return false;
      if (categoryLabel && b.categoryLabel !== categoryLabel) return false;
      if (offeringTitle && b.tourTitle !== offeringTitle) return false;
      return true;
    }).length;
  }

  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-category" className="text-xs font-medium text-muted-foreground">
            Tour type
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setOffering("all");
            }}
            className={fieldClass}
          >
            <option value="all">All types</option>
            {tourCategoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-offering" className="text-xs font-medium text-muted-foreground">
            Offering
          </label>
          <select
            id="filter-offering"
            value={offering}
            onChange={(e) => setOffering(e.target.value)}
            className={fieldClass}
          >
            <option value="all">All offerings</option>
            {offeringOptions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Max bookings / day
          </span>
          <span className="flex h-9 items-center text-sm text-foreground">
            {cap > 0 ? (
              <>
                {cap} <span className="ml-1 text-muted-foreground">/ day</span>
              </>
            ) : (
              <span className="text-muted-foreground">Pick an offering</span>
            )}
          </span>
        </div>
      </div>

      {cap === 0 ? (
        <p className="text-xs text-muted-foreground">
          Select a specific offering to see its daily cap and which days are full.
          Set each offering&apos;s cap on its Add / Edit tour form.
        </p>
      ) : null}

      {/* Calendar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">{MONTH_LABEL}</h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Has bookings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Full
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekdays.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              {d}
            </div>
          ))}

          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`blank-${index}`} className="aspect-square" />;
            }
            const count = countOnDay(day);
            const isToday = day === TODAY;
            const isFull = cap > 0 && count >= cap;

            return (
              <div
                key={day}
                className={`flex aspect-square flex-col rounded-lg border p-1.5 sm:p-2 ${
                  isFull
                    ? "border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10"
                    : isToday
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                }`}
              >
                <span
                  className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}
                >
                  {day}
                </span>
                {count > 0 ? (
                  <span
                    className={`mt-auto inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:text-xs ${
                      isFull
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {cap > 0 ? `${count}/${cap}` : count}
                    {isFull ? " full" : ""}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
