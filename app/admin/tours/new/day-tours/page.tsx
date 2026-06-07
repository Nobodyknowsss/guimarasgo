import { AdminPageHeader } from "@/components/admin/stat-card";
import { DayTourForm } from "@/components/admin/day-tour-form";

export default function NewDayTourPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add day tour"
        description="Create a new day-tour listing."
      />

      <DayTourForm mode="create" />
    </div>
  );
}
