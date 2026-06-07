import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Presentational cover image for tour listings. Shows the photo when one exists,
// otherwise a muted placeholder with the category icon. Used by both the listing
// cards and the detail-page hero, so the visual is consistent across tour types.
export function TourCover({
  photo,
  title,
  icon: Icon,
  className,
}: {
  photo: string | null;
  title: string;
  icon: LucideIcon;
  className?: string;
}) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={title}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
      <Icon className="h-10 w-10 opacity-30" />
    </div>
  );
}
