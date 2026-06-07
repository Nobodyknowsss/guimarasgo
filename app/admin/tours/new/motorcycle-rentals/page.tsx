import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { MotorcycleRentalForm } from "@/components/admin/motorcycle-rental-form";

export default function NewMotorcycleRentalPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/tours/new"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to tour types
      </Link>

      <AdminPageHeader
        title="Add motorcycle rental"
        description="Create a new motorcycle-rental listing."
      />

      <MotorcycleRentalForm mode="create" />
    </div>
  );
}
