import { Bike, Gauge, type LucideIcon } from "lucide-react";
import type { TourBadge } from "./shared";

// Motorcycle rentals. Priced per day; the detail page emphasises the bike's
// specs, what's included, delivery, and the rental terms — fields that don't
// apply to the tour categories.
export interface RentalSpec {
  label: string;
  value: string;
}

export interface MotorcycleRental {
  slug: string;
  title: string;
  /** Where the bike is picked up / delivered from. */
  location: string;
  /** Per day, in PHP. */
  pricePerDay: number;
  rating: number;
  reviews: number;
  /** Max bookings allowed per day for this offering. */
  maxPerDay: number;
  badge: TourBadge | null;
  gradient: string;
  shortDescription: string;
  overview: string;
  /** Key bike specs shown as a labelled grid. */
  specs: RentalSpec[];
  highlights: string[];
  included: string[];
  /** Pickup / delivery details. */
  delivery: string;
  /** Deposit, licence, fuel and other rental conditions. */
  rentalTerms: string[];
}

export const motorcycleRentalsMeta = {
  slug: "motorcycle-rentals" as const,
  label: "Motorcycle Rentals",
  icon: Bike as LucideIcon,
  metaIcon: Gauge as LucideIcon,
  priceUnit: "day" as const,
  reservationFee: 50,
  title: "Explore Guimaras at your own pace",
  intro:
    "Well-maintained scooters and adventure bikes, delivered to your wharf or accommodation. Reserve for ₱50 — pay the balance on arrival.",
};

export const motorcycleRentals: MotorcycleRental[] = [
  {
    slug: "honda-click-125",
    maxPerDay: 8,
    title: "Honda Click 125 Scooter",
    location: "Jordan Wharf pickup",
    pricePerDay: 450,
    rating: 4.9,
    reviews: 312,
    badge: "Popular",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    shortDescription:
      "The all-rounder. Light, easy to ride, great fuel economy. Helmets and phone holder included.",
    overview:
      "The bike most of our riders pick, and for good reason. The Honda Click 125 is light, automatic, and sips fuel — easy enough for a first-timer but happy to take on the whole island. It comes ready to navigate with a phone holder and two helmets included.",
    specs: [
      { label: "Transmission", value: "Automatic" },
      { label: "Engine", value: "125cc" },
      { label: "Seats", value: "2 riders" },
      { label: "Fuel", value: "~50 km/L" },
    ],
    highlights: [
      "Light, automatic, and beginner-friendly",
      "Excellent fuel economy",
      "Two helmets and a phone holder included",
      "Comfortable for two riders",
    ],
    included: [
      "Two helmets",
      "Phone holder",
      "Basic orientation at handover",
      "Roadside support line",
    ],
    delivery:
      "Jordan Wharf pickup. Delivery to nearby accommodation can be arranged.",
    rentalTerms: [
      "A valid driver's license is required at handover.",
      "Fuel is not included — handed over with a small starting amount.",
      "A refundable cash deposit may be collected on pickup.",
      "Minimum rental of one day.",
    ],
  },
  {
    slug: "yamaha-mio-125",
    maxPerDay: 6,
    title: "Yamaha Mio 125 Scooter",
    location: "Jordan Wharf pickup",
    pricePerDay: 400,
    rating: 4.8,
    reviews: 248,
    badge: null,
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
    shortDescription:
      "Compact and forgiving — a good first-rental pick. Smooth automatic gearbox, room for two.",
    overview:
      "A compact, forgiving scooter that's a great first rental. The Yamaha Mio 125's smooth automatic gearbox and low seat make it easy to handle around town and along the coastal roads, with enough room for two and our cheapest day rate.",
    specs: [
      { label: "Transmission", value: "Automatic" },
      { label: "Engine", value: "125cc" },
      { label: "Seats", value: "2 riders" },
      { label: "Fuel", value: "~48 km/L" },
    ],
    highlights: [
      "Compact and easy to handle",
      "Smooth automatic gearbox",
      "Lowest daily rate",
      "Room for two riders",
    ],
    included: [
      "Two helmets",
      "Phone holder",
      "Basic orientation at handover",
      "Roadside support line",
    ],
    delivery:
      "Jordan Wharf pickup. Delivery to nearby accommodation can be arranged.",
    rentalTerms: [
      "A valid driver's license is required at handover.",
      "Fuel is not included — handed over with a small starting amount.",
      "A refundable cash deposit may be collected on pickup.",
      "Minimum rental of one day.",
    ],
  },
  {
    slug: "honda-xr150l-adventure",
    maxPerDay: 3,
    title: "Honda XR150L Adventure",
    location: "Delivered to your stay",
    pricePerDay: 700,
    rating: 4.9,
    reviews: 96,
    badge: "New",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    shortDescription:
      "For the off-the-beaten-track riders. Manual, taller saddle, handles dirt roads with no drama.",
    overview:
      "Built for riders who want to leave the paved roads behind. The Honda XR150L is a manual dual-sport with a taller saddle and proper suspension, so the dirt tracks to Guimaras' more remote coves and viewpoints don't faze it. Delivered straight to your accommodation.",
    specs: [
      { label: "Transmission", value: "Manual (5-speed)" },
      { label: "Engine", value: "150cc" },
      { label: "Seats", value: "2 riders" },
      { label: "Type", value: "Dual-sport" },
    ],
    highlights: [
      "Manual dual-sport built for rough roads",
      "Taller saddle and longer-travel suspension",
      "Comfortable for longer exploring days",
      "Delivered to your accommodation",
    ],
    included: [
      "Two helmets",
      "Phone holder",
      "Delivery to your stay",
      "Basic orientation at handover",
    ],
    delivery: "Delivered to your accommodation anywhere on the island.",
    rentalTerms: [
      "Manual transmission — prior riding experience recommended.",
      "A valid driver's license is required at handover.",
      "Fuel is not included — handed over with a small starting amount.",
      "A refundable cash deposit may be collected on delivery.",
    ],
  },
  {
    slug: "honda-adv160-premium",
    maxPerDay: 2,
    title: "Honda ADV160 Premium",
    location: "Delivered to your stay",
    pricePerDay: 900,
    rating: 5.0,
    reviews: 41,
    badge: "Premium",
    gradient: "from-slate-700 via-slate-900 to-black",
    shortDescription:
      "Big-wheel adventure scooter. Comfortable for long days, two-up friendly, top-box included.",
    overview:
      "Our most comfortable rental. The Honda ADV160 is a big-wheel adventure scooter that eats up long days two-up, with a relaxed riding position, a top-box for your gear, and the convenience of full automatic. Delivered to your door, ready to ride.",
    specs: [
      { label: "Transmission", value: "Automatic" },
      { label: "Engine", value: "160cc" },
      { label: "Seats", value: "2 riders" },
      { label: "Storage", value: "Top-box included" },
    ],
    highlights: [
      "Big-wheel adventure scooter, fully automatic",
      "Comfortable for long days and two riders",
      "Lockable top-box included",
      "Delivered to your accommodation",
    ],
    included: [
      "Two helmets",
      "Phone holder",
      "Lockable top-box",
      "Delivery to your stay",
    ],
    delivery: "Delivered to your accommodation anywhere on the island.",
    rentalTerms: [
      "A valid driver's license is required at handover.",
      "Fuel is not included — handed over with a small starting amount.",
      "A refundable cash deposit may be collected on delivery.",
      "Minimum rental of one day.",
    ],
  },
];

export function getMotorcycleRental(slug: string): MotorcycleRental | undefined {
  return motorcycleRentals.find((rental) => rental.slug === slug);
}
