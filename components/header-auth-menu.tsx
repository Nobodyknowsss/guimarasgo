"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  LogIn,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getProfile(user: User) {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const first = String(meta.first_name ?? "").trim();
  const last = String(meta.last_name ?? "").trim();
  const name = [first, last].filter(Boolean).join(" ");
  const initials = `${first[0] ?? ""}${last[0] ?? ""}`.trim();
  // Fall back to the email's first character if the name isn't set yet.
  const avatar = (initials || user.email?.[0] || "").toUpperCase();
  return {
    name: name || user.email || "Your account",
    email: user.email ?? "",
    avatar,
  };
}

export function HeaderAuthMenu({ onHero = false }: { onHero?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!loaded) {
    return <span className="h-9 w-[72px]" aria-hidden />;
  }

  if (user) {
    const profile = getProfile(user);

    const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className={cn(
              "grid h-9 w-9 cursor-pointer place-items-center rounded-full text-sm font-semibold transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              onHero
                ? "border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {profile.avatar ? (
              <span aria-hidden>{profile.avatar}</span>
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-60">
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {profile.name}
            </p>
            {profile.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {profile.email}
              </p>
            ) : null}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <UserIcon />
              My account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookings" className="cursor-pointer">
              <CalendarCheck />
              Bookings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href="/auth/login"
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
        onHero
          ? "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
          : "border border-border bg-background text-foreground/80 hover:border-primary/50 hover:text-primary",
      )}
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Sign in</span>
    </Link>
  );
}
