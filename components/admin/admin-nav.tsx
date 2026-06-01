"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Ticket,
  CalendarDays,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/tours", label: "Tours", icon: Ticket },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Fixed left sidebar — visible on lg and up. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/admin" className="text-lg font-bold tracking-tight text-foreground">
          GuimarasGo
        </Link>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, href)
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}

/** Horizontal scrollable nav — visible below lg. */
export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            isActive(pathname, href)
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
