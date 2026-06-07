import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { tourCategoryOptions } from "@/lib/admin/data";

// Which category forms are built so far.
const available = new Set<string>(["island-hopping"]);

const descriptions: Record<string, string> = {
  "island-hopping": "Boat trips priced per person.",
  "day-tours": "Land tours priced per group.",
  "motorcycle-rentals": "Bikes priced per day.",
};

export default function NewTourChooserPage() {
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
        description="Choose the type of listing to create."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {tourCategoryOptions.map((category) => {
          const Icon = category.icon;
          const isAvailable = available.has(category.slug);

          const inner = (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold text-foreground">
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {descriptions[category.slug]}
              </p>
              <span
                className={cn(
                  "mt-4 inline-flex items-center gap-1 text-sm font-medium",
                  isAvailable ? "text-primary" : "text-muted-foreground",
                )}
              >
                {isAvailable ? (
                  <>
                    Create
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                ) : (
                  "Coming soon"
                )}
              </span>
            </>
          );

          const base =
            "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors";

          return isAvailable ? (
            <Link
              key={category.slug}
              href={`/admin/tours/new/${category.slug}`}
              className={cn(
                base,
                "cursor-pointer hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              )}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={category.slug}
              aria-disabled="true"
              className={cn(base, "cursor-not-allowed opacity-60")}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
