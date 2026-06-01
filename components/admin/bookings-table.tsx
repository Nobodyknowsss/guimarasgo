"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  adminBookings,
  bookingStatusStyles,
  formatDate,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/admin/data";

const filters = ["all", "confirmed", "pending", "cancelled"] as const;
type Filter = (typeof filters)[number];

const statusOptions: BookingStatus[] = ["confirmed", "pending", "cancelled"];

export function BookingsTable() {
  // Local-only state: status edits feel live but reset on reload (no backend).
  const [rows, setRows] = useState<AdminBooking[]>(adminBookings);
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    return {
      all: rows.length,
      confirmed: rows.filter((r) => r.status === "confirmed").length,
      pending: rows.filter((r) => r.status === "pending").length,
      cancelled: rows.filter((r) => r.status === "cancelled").length,
    };
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  function setStatus(id: string, status: BookingStatus) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground/70 ring-1 ring-border hover:text-foreground",
            )}
          >
            {f}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                filter === f ? "bg-white/20" : "bg-muted",
              )}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[820px] text-sm">
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
                className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
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
                  {booking.feePaid ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <X className="h-3.5 w-3.5" /> Unpaid
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      setStatus(booking.id, e.target.value as BookingStatus)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize outline-none ring-1 ring-inset ring-transparent focus:ring-primary",
                      bookingStatusStyles[booking.status],
                    )}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-background text-foreground">
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
