import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { IslandHoppingForm } from "@/components/admin/island-hopping-form";

export default function NewIslandHoppingTourPage() {
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
        title="Add island hopping tour"
        description="Create a new island-hopping listing."
      />

      <IslandHoppingForm />
    </div>
  );
}
