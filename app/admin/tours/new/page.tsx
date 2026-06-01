import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { TourForm } from "@/components/admin/tour-form";

export default function NewTourPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to tours
      </Link>
      <AdminPageHeader
        title="Add tour"
        description="Create a new listing in one of the three categories."
      />
      <TourForm mode="create" />
    </div>
  );
}
