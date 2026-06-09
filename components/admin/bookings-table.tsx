"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  bookingStatusStyles,
  formatDate,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/admin/data";

const filters = ["all", "confirmed", "pending", "cancelled"] as const;
type Filter = (typeof filters)[number];

const statusOptions: BookingStatus[] = ["confirmed", "pending", "cancelled"];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

function FeeBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <Check className="h-3.5 w-3.5" /> Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <X className="h-3.5 w-3.5" /> Unpaid
    </span>
  );
}

export function BookingsTable({
  initialRows,
}: {
  initialRows: AdminBooking[];
}) {
  const [rows, setRows] = useState<AdminBooking[]>(initialRows);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(() => {
    return {
      all: rows.length,
      confirmed: rows.filter((r) => r.status === "confirmed").length,
      pending: rows.filter((r) => r.status === "pending").length,
      cancelled: rows.filter((r) => r.status === "cancelled").length,
    };
  }, [rows]);

  const visible =
    filter === "all" ? rows : rows.filter((r) => r.status === filter);

  // Optimistically update, then persist. Revert the row if the server rejects it.
  function setStatus(id: string, status: BookingStatus) {
    const previous = rows.find((r) => r.id === id)?.status;
    setError(null);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    const revert = () => {
      if (previous) {
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: previous } : r)),
        );
      }
    };

    startTransition(async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Could not update the booking. Try again.");
          revert();
        }
      } catch {
        setError("Network error. Try again.");
        revert();
      }
    });
  }

  const statusSelectClass = (status: BookingStatus) =>
    cn(
      "cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize outline-none ring-1 ring-inset ring-transparent focus-visible:ring-primary",
      bookingStatusStyles[status],
    );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No bookings yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Reservations will appear here as customers book.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          {error}
        </p>
      ) : null}

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              focusRing,
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground/70 ring-1 ring-border hover:text-foreground",
            )}
          >
            {f}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                filter === f ? "bg-white/20" : "bg-muted",
              )}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile / tablet: cards */}
      <div className="grid gap-3 md:hidden">
        {visible.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-foreground">
                  {booking.customerName}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {booking.customerEmail}
                </div>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {booking.reference}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-sm text-foreground">{booking.tourTitle}</div>
              <div className="text-xs text-muted-foreground">
                {booking.categoryLabel}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{formatDate(booking.date)}</span>
              <span>Party of {booking.partySize}</span>
              <FeeBadge paid={booking.feePaid} />
            </div>

            <div className="mt-3">
              <label className="sr-only" htmlFor={`status-${booking.id}`}>
                Status for {booking.reference}
              </label>
              <select
                id={`status-${booking.id}`}
                value={booking.status}
                onChange={(e) =>
                  setStatus(booking.id, e.target.value as BookingStatus)
                }
                className={statusSelectClass(booking.status)}
              >
                {statusOptions.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-background text-foreground"
                  >
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Tour</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Party</th>
              <th className="px-5 py-3 font-medium">Fee</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                  {booking.reference}
                </td>
                <td className="px-5 py-3">
                  <div className="font-medium text-foreground">
                    {booking.customerName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.customerEmail}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="text-foreground">{booking.tourTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {booking.categoryLabel}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDate(booking.date)}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {booking.partySize}
                </td>
                <td className="px-5 py-3">
                  <FeeBadge paid={booking.feePaid} />
                </td>
                <td className="px-5 py-3">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      setStatus(booking.id, e.target.value as BookingStatus)
                    }
                    aria-label={`Status for ${booking.reference}`}
                    className={statusSelectClass(booking.status)}
                  >
                    {statusOptions.map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-background text-foreground"
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
