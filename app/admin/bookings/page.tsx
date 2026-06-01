import { AdminPageHeader } from "@/components/admin/stat-card";
import { BookingsTable } from "@/components/admin/bookings-table";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Bookings"
        description="Every reservation across island hopping, day tours, and rentals. Filter by status or update a booking."
      />
      <BookingsTable />
    </div>
  );
}
