import { AdminPageHeader } from "@/components/admin/stat-card";
import { AvailabilityCalendar } from "@/components/admin/availability-calendar";

export default function AdminAvailabilityPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Availability"
        description="Reserved slots by day. Filter by tour type or offering, and set a daily booking cap."
      />
      <AvailabilityCalendar />
    </div>
  );
}
