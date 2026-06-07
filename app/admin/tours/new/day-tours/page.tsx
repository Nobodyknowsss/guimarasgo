import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { DayTourForm } from "@/components/admin/day-tour-form";

export default function NewDayTourPage() {
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
        title="Add day tour"
        description="Create a new day-tour listing."
      />

      <DayTourForm mode="create" />
    </div>
  );
}
