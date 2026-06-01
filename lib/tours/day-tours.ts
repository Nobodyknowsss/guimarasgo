import { Sun, Users, type LucideIcon } from "lucide-react";
import type { TourBadge } from "./shared";

// Land day tours. Priced per group; the detail page emphasises the stops on the
// route and pickup logistics.
export interface DayTour {
  slug: string;
  title: string;
  location: string;
  /** Per group, in PHP. */
  price: number;
  rating: number;
  reviews: number;
  /** e.g. "Half day", "Full day". */
  duration: string;
  /** Max bookings allowed per day for this offering. */
  maxPerDay: number;
  badge: TourBadge | null;
  gradient: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  /** Ordered stops on the route. */
  stops: string[];
  included: string[];
  /** Pickup logistics for the day. */
  pickup: string;
  goodToKnow: string[];
}

export const dayToursMeta = {
  slug: "day-tours" as const,
  label: "Day Tours",
  icon: Sun as LucideIcon,
  metaIcon: Users as LucideIcon,
  priceUnit: "group" as const,
  reservationFee: 100,
  title: "See the island by land",
  intro:
    "Driver-guided day tours hitting Guimaras' landmarks, mango farms, and hidden viewpoints. Reserve a slot for ₱100 — pay the balance on arrival.",
};

export const dayTours: DayTour[] = [
  {
    slug: "trappist-monastery-mango-farm",
    maxPerDay: 4,
    title: "Trappist Monastery & Mango Farm",
    location: "Jordan",
    price: 1200,
    rating: 4.9,
    reviews: 184,
    duration: "Half day",
    badge: "Popular",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    shortDescription:
      "Quiet morning at the Trappist Monastery, then a stop at a working mango plantation for tastings and a snack.",
    overview:
      "An easygoing half-day that pairs Guimaras' most peaceful landmark with its most famous export. Start at the Trappist Monastery — the only one of its kind in the Philippines — then drive out to a working mango plantation to taste the fruit the island is known for, in season, straight from the source.",
    highlights: [
      "Visit to the Trappist Monastery and its quiet grounds",
      "Tour and tastings at a working mango plantation",
      "Stop at the monastery shop for mango products",
      "Relaxed, mostly shaded itinerary",
    ],
    stops: [
      "Trappist Monastery",
      "Monastery products shop",
      "Working mango plantation",
      "Mango tasting & snack",
    ],
    included: [
      "Air-conditioned vehicle and driver-guide",
      "All driving between stops",
      "Mango tasting and a light snack",
      "Bottled water",
    ],
    pickup: "Pickup from your accommodation or Jordan Wharf on arrival.",
    goodToKnow: [
      "Dress modestly for the monastery (shoulders and knees covered).",
      "Mango tasting availability depends on the season.",
      "Half-day tour; usually wraps up by early afternoon.",
    ],
  },
  {
    slug: "guisi-lighthouse-day-trip",
    maxPerDay: 4,
    title: "Guisi Lighthouse Day Trip",
    location: "Nueva Valencia",
    price: 1500,
    rating: 4.7,
    reviews: 96,
    duration: "Half day",
    badge: null,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    shortDescription:
      "Spanish-era lighthouse ruins on a clifftop, with a viewpoint sunset stop on the way back. Snacks included.",
    overview:
      "A short drive south brings you to the Guisi lighthouse — Spanish-era ruins perched on a cliff above the sea, with a rusting steel tower you can still climb for the view. We time the return around a coastal viewpoint so you catch the light as it drops.",
    highlights: [
      "Spanish-era Guisi lighthouse ruins and steel tower",
      "Clifftop views over the Panay Gulf",
      "Coastal viewpoint stop on the way back",
      "Time for photos at every stop",
    ],
    stops: [
      "Guisi lighthouse ruins",
      "Old steel tower climb",
      "Clifftop viewpoint",
      "Coastal sunset stop",
    ],
    included: [
      "Air-conditioned vehicle and driver-guide",
      "All driving between stops",
      "Snacks and bottled water",
      "Entrance and parking fees",
    ],
    pickup: "Pickup from your accommodation or Jordan Wharf on arrival.",
    goodToKnow: [
      "The walk to the lighthouse is short but uneven — wear closed shoes.",
      "The old tower is climbed at your own risk.",
      "Bring sun protection; the clifftop is exposed.",
    ],
  },
  {
    slug: "south-guimaras-heritage-loop",
    maxPerDay: 3,
    title: "South Guimaras Heritage Loop",
    location: "Nueva Valencia · Sibunag",
    price: 1800,
    rating: 4.8,
    reviews: 71,
    duration: "Full day",
    badge: "New",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    shortDescription:
      "Old churches, fishing villages, and the south coast viewpoints — a full-day driver-guided loop with lunch.",
    overview:
      "A fuller day for travellers who want to see how the south of the island actually lives. The loop links old churches, working fishing villages, and a string of south-coast viewpoints, with a local lunch stop in the middle. Your driver-guide fills in the history as you go.",
    highlights: [
      "Historic churches across the south of the island",
      "Stops in working fishing villages",
      "South-coast viewpoints",
      "Local lunch included",
    ],
    stops: [
      "Nueva Valencia church",
      "Coastal fishing village",
      "South-coast viewpoint",
      "Local lunch stop",
      "Sibunag heritage site",
    ],
    included: [
      "Air-conditioned vehicle and driver-guide",
      "All driving between stops",
      "Local lunch and bottled water",
      "Entrance and parking fees",
    ],
    pickup: "Pickup from your accommodation or Jordan Wharf on arrival.",
    goodToKnow: [
      "Full-day loop with a fair amount of driving between stops.",
      "Let us know of any dietary needs for the lunch stop.",
      "Bring sun protection and comfortable walking shoes.",
    ],
  },
  {
    slug: "northern-coves-beaches",
    maxPerDay: 4,
    title: "Northern Coves & Beaches",
    location: "Buenavista",
    price: 1400,
    rating: 4.8,
    reviews: 58,
    duration: "Full day",
    badge: null,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    shortDescription:
      "Hidden coves and quiet white-sand stretches on the north shore. Perfect for couples and small families.",
    overview:
      "A relaxed full day along the north shore, away from the busier southern beaches. We string together a few hidden coves and quiet white-sand stretches with time to swim and unwind at each, plus a lunch stop. Easy going, low on driving, and good for couples and small families.",
    highlights: [
      "Several quiet north-shore coves and beaches",
      "Swimming and downtime at each stop",
      "Lunch by the water",
      "Calmer alternative to the popular southern beaches",
    ],
    stops: [
      "Buenavista viewpoint",
      "First hidden cove",
      "White-sand beach lunch",
      "Quiet north-shore swimming stop",
    ],
    included: [
      "Air-conditioned vehicle and driver-guide",
      "All driving between stops",
      "Lunch and bottled water",
      "Entrance and parking fees",
    ],
    pickup: "Pickup from your accommodation or Buenavista on arrival.",
    goodToKnow: [
      "Bring swimwear, a towel, and sun protection.",
      "Some coves have limited facilities.",
      "Full-day tour; usually back by late afternoon.",
    ],
  },
];

export function getDayTour(slug: string): DayTour | undefined {
  return dayTours.find((tour) => tour.slug === slug);
}
