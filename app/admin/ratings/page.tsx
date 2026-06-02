import { AdminPageHeader } from "@/components/admin/stat-card";
import { RatingsManager } from "@/components/admin/ratings-manager";

export default function AdminRatingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Ratings"
        description="Add and manage the reviews shown on each tour."
      />
      <RatingsManager />
    </div>
  );
}
