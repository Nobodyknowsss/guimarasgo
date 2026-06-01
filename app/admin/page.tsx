import Link from "next/link";
import {
  CalendarCheck,
  CircleCheck,
  Clock,
  Wallet,
  ArrowRight,
} from "lucide-react";

import { StatCard, AdminPageHeader } from "@/components/admin/stat-card";
import {
  adminBookings,
  getAdminStats,
  formatDate,
  bookingStatusStyles,
} from "@/lib/admin/data";

export default function AdminOverviewPage() {
  const stats = getAdminStats();

  const recent = [...adminBookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="A snapshot of bookings and reservation-fee revenue."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarCheck}
          label="Total bookings"
          value={String(stats.totalBookings)}
          hint="All time"
        />
        <StatCard
          icon={CircleCheck}
          label="Confirmed"
          value={String(stats.confirmed)}
          hint="Fee paid & slot held"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={String(stats.pending)}
          hint="Awaiting reservation fee"
        />
        <StatCard
          icon={Wallet}
          label="Fee revenue"
          value={`₱${stats.feeRevenue.toLocaleString()}`}
          hint="Reservation fees collected"
        />
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Tour</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {booking.reference}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {booking.customerName}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {booking.tourTitle}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(booking.date)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${bookingStatusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
