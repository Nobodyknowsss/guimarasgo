// Shared types and helpers for the admin dashboard.
//
// Bookings and customers are now REAL (read from Postgres via
// services/bookings/admin.ts). The tour catalog and ratings below are still
// derived from the static per-category tour data so the admin "Tours" and
// "Ratings" screens stay in sync with the public site.

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

export interface AdminRating {
  id: string;
  tourSlug: string;
  tourTitle: string;
  categoryLabel: string;
  author: string;
  /** 1–5 stars. */
  rating: number;
  comment: string;
  /** When the review was left (ISO). */
  createdAt: string;
}

export const adminRatings: AdminRating[] = [
  {
    id: "1",
    tourSlug: "classic-7-island-hopping",
    tourTitle: "Classic 7-Island Hopping",
    categoryLabel: "Island Hopping",
    author: "Maria Santos",
    rating: 5,
    comment:
      "Unforgettable day — our boatman knew exactly which coves were quietest. Lunch on the boat was a highlight.",
    createdAt: "2026-05-28",
  },
  {
    id: "2",
    tourSlug: "sunset-firefly-cruise",
    tourTitle: "Sunset & Firefly Cruise",
    categoryLabel: "Island Hopping",
    author: "David Lim",
    rating: 4,
    comment: "Beautiful golden hour and the fireflies were magical. Bring repellent!",
    createdAt: "2026-05-26",
  },
  {
    id: "3",
    tourSlug: "snorkel-reef-half-day",
    tourTitle: "Snorkel & Reef Half-Day",
    categoryLabel: "Island Hopping",
    author: "Grace Tan",
    rating: 5,
    comment: "Great reef spots and the in-water guide pointed out so much. Perfect half day.",
    createdAt: "2026-05-22",
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
  {
    slug: islandHoppingMeta.slug,
    label: islandHoppingMeta.label,
    icon: islandHoppingMeta.icon,
  },
  { slug: dayToursMeta.slug, label: dayToursMeta.label, icon: dayToursMeta.icon },
  {
    slug: motorcycleRentalsMeta.slug,
    label: motorcycleRentalsMeta.label,
    icon: motorcycleRentalsMeta.icon,
  },
];

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
