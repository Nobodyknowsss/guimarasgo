// Sample data for the admin dashboard. This is a FRONTEND-ONLY mockup — there is
// no backend yet, so nothing here is persisted and edits in the UI don't save.
// The tour catalog below is aggregated from the real per-category tour data so
// the admin "Tours" screen stays in sync with the public site.

import { islandHoppingMeta, islandHoppingTours } from "@/lib/tours/island-hopping";
import { dayToursMeta, dayTours } from "@/lib/tours/day-tours";
import {
  motorcycleRentalsMeta,
  motorcycleRentals,
} from "@/lib/tours/motorcycle-rentals";
import type { TourBadge } from "@/lib/tours/shared";

export interface ReservationFee {
  slug: string;
  label: string;
  fee: number;
}

// Per-category reservation fee, sourced from each tour category's meta.
export const reservationFees: ReservationFee[] = [
  {
    slug: islandHoppingMeta.slug,
    label: islandHoppingMeta.label,
    fee: islandHoppingMeta.reservationFee,
  },
  {
    slug: dayToursMeta.slug,
    label: dayToursMeta.label,
    fee: dayToursMeta.reservationFee,
  },
  {
    slug: motorcycleRentalsMeta.slug,
    label: motorcycleRentalsMeta.label,
    fee: motorcycleRentalsMeta.reservationFee,
  },
];

const feeByLabel: Record<string, number> = Object.fromEntries(
  reservationFees.map((f) => [f.label, f.fee]),
);

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface AdminBooking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  categoryLabel: string;
  tourTitle: string;
  /** Date of the tour / rental start (ISO). */
  date: string;
  partySize: number;
  status: BookingStatus;
  /** Whether the ₱100 reservation fee has been paid. */
  feePaid: boolean;
  /** When the booking was made (ISO). */
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  facebook?: string;
  bookings: number;
  joinedAt: string;
}

export interface AdminListing {
  category: string;
  categoryLabel: string;
  slug: string;
  title: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviews: number;
  badge: TourBadge | null;
  shortDescription: string;
  maxPerDay: number;
  active: boolean;
}

export const adminBookings: AdminBooking[] = [
  {
    id: "1",
    reference: "GG-2026-0148",
    customerName: "Maria Santos",
    customerEmail: "maria.santos@example.com",
    categoryLabel: "Island Hopping",
    tourTitle: "Classic 7-Island Hopping",
    date: "2026-06-03",
    partySize: 4,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-30T09:12:00",
  },
  {
    id: "2",
    reference: "GG-2026-0147",
    customerName: "James Cruz",
    customerEmail: "james.cruz@example.com",
    categoryLabel: "Motorcycle Rentals",
    tourTitle: "Honda Click 125 Scooter",
    date: "2026-06-02",
    partySize: 1,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-30T08:01:00",
  },
  {
    id: "3",
    reference: "GG-2026-0146",
    customerName: "Anna Reyes",
    customerEmail: "anna.reyes@example.com",
    categoryLabel: "Day Tours",
    tourTitle: "Trappist Monastery & Mango Farm",
    date: "2026-06-05",
    partySize: 2,
    status: "pending",
    feePaid: false,
    createdAt: "2026-05-31T18:44:00",
  },
  {
    id: "4",
    reference: "GG-2026-0145",
    customerName: "David Lim",
    customerEmail: "david.lim@example.com",
    categoryLabel: "Island Hopping",
    tourTitle: "Sunset & Firefly Cruise",
    date: "2026-06-01",
    partySize: 6,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-29T14:20:00",
  },
  {
    id: "5",
    reference: "GG-2026-0144",
    customerName: "Grace Tan",
    customerEmail: "grace.tan@example.com",
    categoryLabel: "Day Tours",
    tourTitle: "Guisi Lighthouse Day Trip",
    date: "2026-06-07",
    partySize: 3,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-28T11:05:00",
  },
  {
    id: "6",
    reference: "GG-2026-0143",
    customerName: "Mark Villanueva",
    customerEmail: "mark.v@example.com",
    categoryLabel: "Motorcycle Rentals",
    tourTitle: "Honda XR150L Adventure",
    date: "2026-06-04",
    partySize: 1,
    status: "pending",
    feePaid: false,
    createdAt: "2026-05-31T20:10:00",
  },
  {
    id: "7",
    reference: "GG-2026-0142",
    customerName: "Sophia Garcia",
    customerEmail: "sophia.garcia@example.com",
    categoryLabel: "Island Hopping",
    tourTitle: "Private Island Picnic",
    date: "2026-06-12",
    partySize: 8,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-27T16:30:00",
  },
  {
    id: "8",
    reference: "GG-2026-0141",
    customerName: "Paolo Mendoza",
    customerEmail: "paolo.m@example.com",
    categoryLabel: "Day Tours",
    tourTitle: "Northern Coves & Beaches",
    date: "2026-05-31",
    partySize: 2,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-25T10:00:00",
  },
  {
    id: "9",
    reference: "GG-2026-0140",
    customerName: "Bea Aquino",
    customerEmail: "bea.aquino@example.com",
    categoryLabel: "Motorcycle Rentals",
    tourTitle: "Honda ADV160 Premium",
    date: "2026-06-06",
    partySize: 1,
    status: "cancelled",
    feePaid: false,
    createdAt: "2026-05-26T13:15:00",
  },
  {
    id: "10",
    reference: "GG-2026-0139",
    customerName: "Carlo Dizon",
    customerEmail: "carlo.dizon@example.com",
    categoryLabel: "Island Hopping",
    tourTitle: "Snorkel & Reef Half-Day",
    date: "2026-06-09",
    partySize: 5,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-29T19:48:00",
  },
  {
    id: "11",
    reference: "GG-2026-0138",
    customerName: "Liza Bautista",
    customerEmail: "liza.b@example.com",
    categoryLabel: "Day Tours",
    tourTitle: "South Guimaras Heritage Loop",
    date: "2026-06-14",
    partySize: 4,
    status: "pending",
    feePaid: false,
    createdAt: "2026-06-01T07:22:00",
  },
  {
    id: "12",
    reference: "GG-2026-0137",
    customerName: "Nathan Yu",
    customerEmail: "nathan.yu@example.com",
    categoryLabel: "Motorcycle Rentals",
    tourTitle: "Yamaha Mio 125 Scooter",
    date: "2026-06-02",
    partySize: 1,
    status: "confirmed",
    feePaid: true,
    createdAt: "2026-05-30T21:05:00",
  },
];

export const adminCustomers: AdminCustomer[] = [
  {
    id: "1",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@example.com",
    phone: "+63 917 555 0148",
    facebook: "fb.com/maria.santos",
    bookings: 3,
    joinedAt: "2026-03-14",
  },
  {
    id: "2",
    firstName: "James",
    lastName: "Cruz",
    email: "james.cruz@example.com",
    phone: "+63 918 555 0147",
    bookings: 2,
    joinedAt: "2026-04-02",
  },
  {
    id: "3",
    firstName: "Anna",
    lastName: "Reyes",
    email: "anna.reyes@example.com",
    phone: "+63 919 555 0146",
    facebook: "fb.com/anna.reyes",
    bookings: 1,
    joinedAt: "2026-05-21",
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Lim",
    email: "david.lim@example.com",
    phone: "+63 920 555 0145",
    bookings: 4,
    joinedAt: "2026-02-08",
  },
  {
    id: "5",
    firstName: "Grace",
    lastName: "Tan",
    email: "grace.tan@example.com",
    phone: "+63 921 555 0144",
    facebook: "fb.com/grace.tan",
    bookings: 2,
    joinedAt: "2026-03-30",
  },
  {
    id: "6",
    firstName: "Mark",
    lastName: "Villanueva",
    email: "mark.v@example.com",
    phone: "+63 922 555 0143",
    bookings: 1,
    joinedAt: "2026-05-29",
  },
  {
    id: "7",
    firstName: "Sophia",
    lastName: "Garcia",
    email: "sophia.garcia@example.com",
    phone: "+63 923 555 0142",
    facebook: "fb.com/sophia.garcia",
    bookings: 5,
    joinedAt: "2026-01-19",
  },
  {
    id: "8",
    firstName: "Paolo",
    lastName: "Mendoza",
    email: "paolo.m@example.com",
    phone: "+63 924 555 0141",
    bookings: 2,
    joinedAt: "2026-04-17",
  },
];

/** All listings across the three tour types, aggregated from the live catalog. */
export const adminListings: AdminListing[] = [
  ...islandHoppingTours.map((tour) => ({
    category: islandHoppingMeta.slug,
    categoryLabel: islandHoppingMeta.label,
    slug: tour.slug,
    title: tour.title,
    price: tour.price,
    priceUnit: islandHoppingMeta.priceUnit,
    rating: tour.rating,
    reviews: tour.reviews,
    badge: tour.badge,
    shortDescription: tour.shortDescription,
    maxPerDay: tour.maxPerDay,
    active: true,
  })),
  ...dayTours.map((tour) => ({
    category: dayToursMeta.slug,
    categoryLabel: dayToursMeta.label,
    slug: tour.slug,
    title: tour.title,
    price: tour.price,
    priceUnit: dayToursMeta.priceUnit,
    rating: tour.rating,
    reviews: tour.reviews,
    badge: tour.badge,
    shortDescription: tour.shortDescription,
    maxPerDay: tour.maxPerDay,
    active: true,
  })),
  ...motorcycleRentals.map((rental) => ({
    category: motorcycleRentalsMeta.slug,
    categoryLabel: motorcycleRentalsMeta.label,
    slug: rental.slug,
    title: rental.title,
    price: rental.pricePerDay,
    priceUnit: motorcycleRentalsMeta.priceUnit,
    rating: rental.rating,
    reviews: rental.reviews,
    badge: rental.badge,
    shortDescription: rental.shortDescription,
    maxPerDay: rental.maxPerDay,
    active: true,
  })),
];

export const tourCategoryOptions = [
  { slug: islandHoppingMeta.slug, label: islandHoppingMeta.label },
  { slug: dayToursMeta.slug, label: dayToursMeta.label },
  { slug: motorcycleRentalsMeta.slug, label: motorcycleRentalsMeta.label },
];

export function getAdminStats() {
  const totalBookings = adminBookings.length;
  const confirmed = adminBookings.filter((b) => b.status === "confirmed").length;
  const pending = adminBookings.filter((b) => b.status === "pending").length;
  const feeRevenue = adminBookings
    .filter((b) => b.feePaid)
    .reduce((sum, b) => sum + (feeByLabel[b.categoryLabel] ?? 0), 0);
  return { totalBookings, confirmed, pending, feeRevenue };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const bookingStatusStyles: Record<BookingStatus, string> = {
  confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};
