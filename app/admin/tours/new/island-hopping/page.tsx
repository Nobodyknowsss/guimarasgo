import { AdminPageHeader } from "@/components/admin/stat-card";
import { IslandHoppingForm } from "@/components/admin/island-hopping-form";

export default function NewIslandHoppingTourPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add island hopping tour"
        description="Create a new island-hopping listing."
      />

      <IslandHoppingForm />
    </div>
  );
}
