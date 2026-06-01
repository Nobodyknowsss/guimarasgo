import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { ToursManager } from "@/components/admin/tours-manager";

export default function AdminToursPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Tours"
        description="Manage every listing across island hopping, day tours, and rentals."
        action={
          <Link
            href="/admin/tours/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add tour
          </Link>
        }
      />
      <ToursManager />
    </div>
  );
}
