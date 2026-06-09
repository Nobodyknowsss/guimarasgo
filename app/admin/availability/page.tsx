import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { AvailabilityCalendar } from "@/components/admin/availability-calendar";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminBookings } from "@/services/bookings/admin";

export default function AdminAvailabilityPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Availability"
        description="Reserved slots by day. Filter by tour type or offering, and set a daily booking cap."
      />
      <Suspense
        fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />}
      >
        <AvailabilityLoader />
      </Suspense>
    </div>
  );
}

async function AvailabilityLoader() {
  await connection();
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.status === 401 ? "/auth/login?next=/admin/availability" : "/");
  }

  const rows = await getAdminBookings();
  const bookings = rows.map((b) => ({
    date: b.date.slice(0, 10),
    categoryLabel: b.categoryLabel,
    tourTitle: b.tourTitle,
    status: b.status,
  }));

  return <AvailabilityCalendar bookings={bookings} />;
}
