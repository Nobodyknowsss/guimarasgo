import { AdminPageHeader } from "@/components/admin/stat-card";
import { MotorcycleRentalForm } from "@/components/admin/motorcycle-rental-form";

export default function NewMotorcycleRentalPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add motorcycle rental"
        description="Create a new motorcycle-rental listing."
      />

      <MotorcycleRentalForm mode="create" />
    </div>
  );
}
