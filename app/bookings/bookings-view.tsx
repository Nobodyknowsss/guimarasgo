"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Sailboat,
  Sun,
  Bike,
  MapPin,
  CalendarDays,
  ArrowRight,
  Wallet,
  Zap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { TourCover } from "@/components/tours/tour-cover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Serializable shapes passed down from the server page. `bookings` is loaded from
// the customer's real Booking rows (prisma.booking.findMany by userId); when they
// have none, the page renders the empty state with the 3 newest listings.
export type ServiceKey = "ISLAND_HOPPING" | "DAY_TOUR" | "MOTORCYCLE_RENTAL";
export type BookingStatus = "UPCOMING" | "COMPLETED";

export type Booking = {
  id: string;
  reference: string;
  service: ServiceKey;
  /** Listing id, used to link through to the full tour page. */
  offeringId: string;
  title: string;
  location: string;
  dateLabel: string;
  /** Number of guests on the booking. */
  partySize: number;
  status: BookingStatus;
  /** Remaining service price, paid in person on arrival. */
  balance: number;
};

export type NewestListing = {
  id: string;
  service: ServiceKey;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  /** Public photo URL, or null for the icon placeholder. */
  photo: string | null;
};

const serviceMeta: Record<
  ServiceKey,
  { label: string; icon: LucideIcon; slug: string; gradient: string }
> = {
  ISLAND_HOPPING: {
    label: "Island Hopping",
    icon: Sailboat,
    slug: "island-hopping",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
  },
  DAY_TOUR: {
    label: "Day Tours",
    icon: Sun,
    slug: "day-tours",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  MOTORCYCLE_RENTAL: {
    label: "Motorcycle Rentals",
    icon: Bike,
    slug: "motorcycle-rentals",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
  },
};

const statusStyles: Record<BookingStatus, string> = {
  UPCOMING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

type TabKey = "ALL" | ServiceKey;

const tabs: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "All Bookings" },
  { key: "ISLAND_HOPPING", label: "Island Hopping" },
  { key: "DAY_TOUR", label: "Day Tours" },
  { key: "MOTORCYCLE_RENTAL", label: "Motorcycle Rentals" },
];

const reassurance = [
  { icon: Wallet, text: "Just ₱100 to reserve" },
  { icon: Zap, text: "Pay the rest on arrival" },
  { icon: ShieldCheck, text: "Never double-booked" },
];

function ServiceThumb({
  service,
  photo,
}: {
  service: ServiceKey;
  photo: string | null;
}) {
  const meta = serviceMeta[service];
  if (photo) {
    return (
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <TourCover photo={photo} title={meta.label} icon={meta.icon} />
      </div>
    );
  }
  return (
    <div
      className={`relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br text-white sm:h-24 sm:w-24 ${meta.gradient}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
      <meta.icon className="h-7 w-7" />
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const meta = serviceMeta[booking.service];

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex gap-4">
        <ServiceThumb service={booking.service} photo={null} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {booking.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
            >
              {booking.status.toLowerCase()}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 px-3 py-2.5 sm:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Date
          </dt>
          <dd className="mt-0.5 flex items-center gap-1 text-xs font-medium text-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{booking.dateLabel}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Guests
          </dt>
          <dd className="mt-0.5 flex items-center gap-1 text-xs font-medium text-foreground">
            <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {booking.partySize}{" "}
            {booking.partySize === 1 ? "person" : "people"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Booking ID
          </dt>
          <dd className="mt-0.5 truncate font-mono text-xs font-medium uppercase text-foreground">
            {booking.reference}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Type
          </dt>
          <dd className="mt-0.5 truncate text-xs font-medium text-foreground">
            {meta.label}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
        <div>
          <span className="text-xs text-muted-foreground">Balance on arrival</span>
          <p className="text-lg font-bold text-foreground">
            ₱{booking.balance.toLocaleString()}
          </p>
        </div>
        <BookingDetailsDialog booking={booking} />
      </div>
    </article>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {children}
      </dd>
    </div>
  );
}

// Full details for a single booking, shown in a modal from "View Details".
function BookingDetailsDialog({ booking }: { booking: Booking }) {
  const meta = serviceMeta[booking.service];

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-9 items-center rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        View Details
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking.title}</DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center gap-1.5">
              <meta.icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </DialogDescription>
        </DialogHeader>

        <dl className="divide-y divide-border">
          <DetailRow label="Status">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
            >
              {booking.status.toLowerCase()}
            </span>
          </DetailRow>
          <DetailRow label="Booking ID">
            <span className="font-mono uppercase">{booking.reference}</span>
          </DetailRow>
          <DetailRow label="Location">{booking.location || "—"}</DetailRow>
          <DetailRow label="Date">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {booking.dateLabel}
            </span>
          </DetailRow>
          <DetailRow label="Guests">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {booking.partySize}{" "}
              {booking.partySize === 1 ? "person" : "people"}
            </span>
          </DetailRow>
          <DetailRow label="Balance on arrival">
            ₱{booking.balance.toLocaleString()}
          </DetailRow>
        </dl>

        <DialogFooter>
          <DialogClose className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary">
            Close
          </DialogClose>
          <Link
            href={`/tours/${meta.slug}/${booking.offeringId}`}
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View tour page
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListingCard({ listing }: { listing: NewestListing }) {
  const meta = serviceMeta[listing.service];

  return (
    <Link
      href={`/tours/${meta.slug}/${listing.id}`}
      className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5"
    >
      <div className="flex gap-4">
        <ServiceThumb service={listing.service} photo={listing.photo} />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <meta.icon className="h-3 w-3" />
            {meta.label}
          </span>
          <h3 className="mt-1.5 truncate text-base font-semibold text-foreground">
            {listing.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <span className="text-xs text-muted-foreground">from</span>
          <p className="text-lg font-bold text-foreground">
            ₱{listing.price.toLocaleString()}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / {listing.priceUnit}
            </span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          View
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ newest }: { newest: NewestListing[] }) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-400/10 via-cyan-400/5 to-transparent" />
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CalendarDays className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          No trips booked yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground">
          Your island adventures will show up here. Reserve any tour or rental
          for just <span className="font-semibold text-foreground">₱100</span>{" "}
          and pay the rest in person when you arrive.
        </p>
        <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          {reassurance.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {newest.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Newest tours &amp; rentals
            </h3>
            <Link
              href="/#tours"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Browse all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {newest.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BookingsView({
  bookings,
  newest,
}: {
  bookings: Booking[];
  newest: NewestListing[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");

  const filtered =
    activeTab === "ALL"
      ? bookings
      : bookings.filter((b) => b.service === activeTab);

  return (
    <>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My bookings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage and track all your reservations.
        </p>
      </div>

      <div className="mb-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex min-w-full gap-1 rounded-full border border-border bg-card p-1 shadow-sm sm:min-w-0">
          {tabs.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState newest={newest} />
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
          No bookings in this category yet.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </>
  );
}
