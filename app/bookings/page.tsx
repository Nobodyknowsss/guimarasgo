import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sailboat,
  Sun,
  Bike,
  ArrowRight,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { createClient } from "@/lib/supabase/server";

// The reservation/booking flow isn't built yet (see CLAUDE.md), and there is no
// Booking model in Prisma. This type + the BookingCard below are the front-end
// for a customer's bookings; once the schema and Reserve flow exist, swap the
// empty array for a `prisma.booking.findMany({ where: { userId } })` query.
type BookingStatus = "CONFIRMED" | "UPCOMING" | "COMPLETED";

type Booking = {
  id: string;
  reference: string;
  service: "ISLAND_HOPPING" | "DAY_TOUR" | "MOTORCYCLE_RENTAL";
  title: string;
  location: string;
  dateLabel: string;
  partyLabel: string;
  status: BookingStatus;
  balance: number; // remaining service price, paid in person on arrival
};

const serviceMeta: Record<
  Booking["service"],
  { icon: typeof Sailboat; label: string; gradient: string }
> = {
  ISLAND_HOPPING: {
    icon: Sailboat,
    label: "Island Hopping",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
  },
  DAY_TOUR: {
    icon: Sun,
    label: "Day Tour",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  MOTORCYCLE_RENTAL: {
    icon: Bike,
    label: "Motorcycle Rental",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
  },
};

const statusStyles: Record<BookingStatus, string> = {
  CONFIRMED: "bg-primary/10 text-primary",
  UPCOMING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-muted text-muted-foreground",
};

const services = [
  {
    icon: Sailboat,
    title: "Island Hopping",
    tag: "From ₱350 / person",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    href: "/tours/island-hopping",
  },
  {
    icon: Sun,
    title: "Day Tours",
    tag: "From ₱1,200 / group",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    href: "/tours/day-tours",
  },
  {
    icon: Bike,
    title: "Motorcycle Rentals",
    tag: "From ₱400 / day",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    href: "/tours/motorcycle-rentals",
  },
];

const reassurance = [
  { icon: Wallet, text: "Just ₱100 to reserve your slot" },
  { icon: Zap, text: "Auto-confirmed — pay the rest on arrival" },
  { icon: ShieldCheck, text: "Never double-booked" },
];

function BookingCard({ booking }: { booking: Booking }) {
  const meta = serviceMeta[booking.service];
  const Icon = meta.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-stretch">
        <div
          className={`relative hidden w-28 shrink-0 bg-gradient-to-br sm:block ${meta.gradient}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md">
            <Icon className="h-5 w-5" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {booking.location}
              </div>
              <h3 className="mt-1 text-base font-semibold text-foreground">
                {booking.title}
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
            >
              {booking.status.toLowerCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {booking.dateLabel}
            </span>
            <span>{booking.partyLabel}</span>
            <span className="font-mono uppercase">{booking.reference}</span>
          </div>

          <div className="mt-1 flex items-end justify-between border-t border-border pt-3">
            <div>
              <span className="text-xs text-muted-foreground">
                Balance on arrival
              </span>
              <p className="text-lg font-bold text-foreground">
                ₱{booking.balance.toLocaleString()}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              ₱100 reservation paid
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyBookings() {
  return (
    <div className="space-y-6">
      {/* Encouraging hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-400/10 via-cyan-400/5 to-transparent" />
        <Image
          src="/guimarasgo-logo.webp"
          alt="GuimarasGo"
          width={323}
          height={226}
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          No trips booked yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-muted-foreground">
          Your island adventures will show up here. Reserve any tour or rental
          for just <span className="font-semibold text-foreground">₱100</span>{" "}
          and pay the rest in person when you arrive — confirmed instantly.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#tours"
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Browse tours
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            How it works
          </Link>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-center sm:gap-6">
          {reassurance.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Quick links into the three services */}
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">
          Start with one of these
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {services.map(({ icon: Icon, title, tag, gradient, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${gradient}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between p-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{tag}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30 pt-24 pb-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<BookingsFallback />}>
            <BookingsList />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function BookingsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/bookings");
  }

  // TODO: replace with a Prisma query once the Booking model + Reserve flow exist.
  const bookings: Booking[] = [];

  return (
    <>
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Your bookings
        </h1>
        <p className="mt-1 text-muted-foreground">
          {bookings.length > 0
            ? "Your reserved tours and rentals, all in one place."
            : "Reserve a slot for ₱100 and your trips will appear here."}
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyBookings />
      )}
    </>
  );
}

function BookingsFallback() {
  return (
    <>
      <div className="mt-6 mb-8">
        <div className="h-9 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-72 w-full animate-pulse rounded-3xl bg-muted" />
    </>
  );
}
