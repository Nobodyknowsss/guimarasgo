import type { LucideIcon } from "lucide-react";

// Pure presentational wrapper for a titled section on a tour detail page.
// Carries no tour data, so each category composes it with its own content.
export function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
