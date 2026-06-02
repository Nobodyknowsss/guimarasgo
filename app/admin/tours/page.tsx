import Link from "next/link";
import { Plus } from "lucide-react";

import { ToursManager } from "@/components/admin/tours-manager";

export default function AdminToursPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link
          href="/admin/tours/new"
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <Plus className="h-4 w-4" />
          Add tour
        </Link>
      </div>
      <ToursManager />
    </div>
  );
}
