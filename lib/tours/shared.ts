// Presentation-only helpers shared across the three (otherwise independent) tour types.
// Each tour category keeps its own data file and field shape; only the badge styling
// lives here so the visual stays consistent.

export type TourBadge = "Popular" | "New" | "Premium";

export const badgeStyles: Record<TourBadge, string> = {
  Popular: "bg-cta text-cta-foreground",
  New: "bg-primary text-primary-foreground",
  Premium: "bg-slate-900 text-white",
};
