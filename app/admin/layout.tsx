import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-nav";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";

export const metadata: Metadata = {
  title: "Admin — GuimarasGo",
  description: "Manage bookings, tours, availability, and customers.",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh bg-muted/20">
      <AdminSidebar />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-base font-bold tracking-tight text-foreground">
              GuimarasGo
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Admin
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <AdminThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <span
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              aria-hidden
            >
              GG
            </span>
          </div>
        </header>

        <AdminMobileNav />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
