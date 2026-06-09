import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { BookingsTable } from "@/components/admin/bookings-table";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminBookings } from "@/services/bookings/admin";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Bookings"
        description="Every reservation across island hopping, day tours, and rentals. Filter by status or update a booking."
      />
      <Suspense
        fallback={<div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />}
      >
        <BookingsLoader />
      </Suspense>
    </div>
  );
}

async function BookingsLoader() {
  await connection();
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.status === 401 ? "/auth/login?next=/admin/bookings" : "/");
  }

  const bookings = await getAdminBookings();
  return <BookingsTable initialRows={bookings} />;
}
