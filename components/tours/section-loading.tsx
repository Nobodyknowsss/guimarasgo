import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

// Suspense fallback for any subtree that reads live data. cacheComponents
// requires uncached reads to sit inside a <Suspense> boundary so the static
// shell can stream first.
export function SectionLoading({ className }: { className?: string }) {
  return (
    <div className={cn("grid min-h-[40vh] place-items-center", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
