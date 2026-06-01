import { Sailboat, Users, type LucideIcon } from "lucide-react";
import type { TourBadge } from "./shared";

// Island-hopping listings. Priced per person; the detail page emphasises the
// islands you visit and the on-boat experience.
export interface IslandHoppingTour {
  slug: string;
  title: string;
  location: string;
  /** Per person, in PHP. */
  price: number;
  rating: number;
  reviews: number;
  /** e.g. "Full day", "Evening". */
  duration: string;
  /** Max bookings allowed per day for this offering. */
  maxPerDay: number;
  badge: TourBadge | null;
  gradient: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  /** The islands / sandbars this trip stops at. */
  islands: string[];
  included: string[];
  meetingPoint: string;
  goodToKnow: string[];
}

export const islandHoppingMeta = {
  slug: "island-hopping" as const,
  label: "Island Hopping",
  icon: Sailboat as LucideIcon,
  metaIcon: Users as LucideIcon,
  priceUnit: "person" as const,
  reservationFee: 100,
  title: "Hop between Guimaras' best-kept islands",
  intro:
    "From the classic 7-island circuit to private picnic charters, every trip is run by GuimarasGo's local boatmen. Reserve a slot for ₱100 — pay the balance on arrival.",
};

export const islandHoppingTours: IslandHoppingTour[] = [
  {
    slug: "classic-7-island-hopping",
    maxPerDay: 6,
    title: "Classic 7-Island Hopping",
    location: "Nueva Valencia",
    price: 450,
    rating: 4.9,
    reviews: 218,
    duration: "Full day",
    badge: "Popular",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    shortDescription:
      "The signature loop through Ave Maria, Natago, Turtle, and four more islands. Snorkel gear and lunch on the boat included.",
    overview:
      "Our most-booked trip and the best way to see Guimaras from the water. You'll cruise the calm channels of Nueva Valencia aboard a traditional bangka, stopping at seven islands and sandbars for swimming, snorkeling, and photos. Your boatman knows which coves are quietest depending on the tide, so no two runs feel quite the same.",
    highlights: [
      "Seven island and sandbar stops in one trip",
      "Snorkeling over shallow coral gardens with gear provided",
      "Grilled lunch served on the boat",
      "Plenty of swimming and photo time at each stop",
    ],
    islands: [
      "Ave Maria Island",
      "Natago Island",
      "Turtle Island",
      "Baras Cave",
      "Ten Commandments Island",
      "Guiwanon sandbar",
      "Fishing-village cove stop",
    ],
    included: [
      "Private bangka boat and licensed boatman",
      "Snorkel mask and life vests",
      "Lunch and drinking water",
      "Environmental and dock fees",
    ],
    meetingPoint:
      "Raymen Beach / Alubihod, Nueva Valencia. Meet your boatman at the shore 15 minutes before departure.",
    goodToKnow: [
      "Trips run on the tide — your exact departure time is confirmed the day before.",
      "Bring sunblock, a hat, and a dry bag for valuables.",
      "Not recommended for non-swimmers without a companion.",
    ],
  },
  {
    slug: "sunset-firefly-cruise",
    maxPerDay: 5,
    title: "Sunset & Firefly Cruise",
    location: "Sibunag",
    price: 600,
    rating: 4.8,
    reviews: 142,
    duration: "Evening",
    badge: "New",
    gradient: "from-orange-400 via-rose-500 to-purple-600",
    shortDescription:
      "Slow cruise through the mangroves at golden hour, then drift past fireflies in the dark. Best with a small group.",
    overview:
      "A quieter, slower trip built around two of the island's best evening moments. You'll set out as the light turns gold, glide through the Sibunag mangrove channels, then cut the engine after dark to watch fireflies blink through the trees. It's an easy, low-effort outing that's especially good for couples and families.",
    highlights: [
      "Golden-hour cruise along the mangrove coast",
      "Fireflies lighting up the mangroves after dark",
      "Calm, sheltered water — very little motion",
      "Hot drinks served on board",
    ],
    islands: ["Sibunag mangrove channels", "Riverside firefly grove"],
    included: [
      "Private bangka boat and licensed boatman",
      "Life vests",
      "Hot drinks and light snacks",
      "Environmental and dock fees",
    ],
    meetingPoint:
      "Sibunag mangrove dock. Directions are sent after booking; pickup from nearby stays can be arranged.",
    goodToKnow: [
      "Departs late afternoon; firefly viewing depends on the moon phase and weather.",
      "Bring light insect repellent and a layer for after sunset.",
      "Best experienced with a small group for the quietest viewing.",
    ],
  },
  {
    slug: "snorkel-reef-half-day",
    maxPerDay: 6,
    title: "Snorkel & Reef Half-Day",
    location: "Nueva Valencia",
    price: 750,
    rating: 4.7,
    reviews: 86,
    duration: "Half day",
    badge: null,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    shortDescription:
      "Two of the island's best reef spots, plus a beach stop for lunch. Gear, guide, and a packed bento included.",
    overview:
      "A focused half-day for people who came for the underwater part. We head straight to two of the healthiest reef spots in Nueva Valencia, with a guide in the water to point out what's worth looking at, then pull up at a quiet beach for a packed lunch before heading back.",
    highlights: [
      "Two hand-picked reef snorkeling sites",
      "In-water guide who knows the reefs",
      "Beach stop with a packed bento lunch",
      "Half-day format leaves your afternoon free",
    ],
    islands: ["Igang reef", "Taklong Island reef", "Quiet beach lunch stop"],
    included: [
      "Private bangka boat and licensed boatman",
      "Snorkel gear and life vests",
      "In-water snorkel guide",
      "Packed bento lunch and water",
    ],
    meetingPoint:
      "Raymen Beach / Alubihod, Nueva Valencia. Meet 15 minutes before departure.",
    goodToKnow: [
      "Morning departures see the clearest water.",
      "Reef-safe sunblock only, please.",
      "Comfortable swimming ability recommended.",
    ],
  },
  {
    slug: "private-island-picnic",
    maxPerDay: 2,
    title: "Private Island Picnic",
    location: "Buenavista",
    price: 3500,
    rating: 5.0,
    reviews: 47,
    duration: "Full day",
    badge: "Premium",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    shortDescription:
      "Your own boat, your own crew, your own cove. Tailored stops, fresh seafood lunch grilled on the beach.",
    overview:
      "The whole boat is yours for the day. Tell us what you're after — a remote sandbar, the best snorkeling, somewhere completely empty for photos — and your crew builds the route around it. The day centers on a fresh seafood lunch grilled right on the beach while you swim.",
    highlights: [
      "Fully private charter — set your own route and pace",
      "Fresh seafood lunch grilled on the beach",
      "Stops chosen for you, including quiet hidden coves",
      "Ideal for celebrations, families, and photoshoots",
    ],
    islands: ["Route built around you", "Hidden coves & sandbars on request"],
    included: [
      "Private boat with dedicated crew for the day",
      "Snorkel gear and life vests",
      "Fresh grilled seafood lunch and drinks",
      "Environmental and dock fees",
    ],
    meetingPoint:
      "Buenavista wharf, or arranged pickup from your accommodation.",
    goodToKnow: [
      "Price covers the boat for up to a small group — ask us about larger parties.",
      "Share any food preferences or allergies when you reserve.",
      "Full-day outing; bring sun protection and a change of clothes.",
    ],
  },
];

export function getIslandHoppingTour(slug: string): IslandHoppingTour | undefined {
  return islandHoppingTours.find((tour) => tour.slug === slug);
}
