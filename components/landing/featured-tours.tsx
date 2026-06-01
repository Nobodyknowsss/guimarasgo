import { MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tours = [
  {
    title: "Classic 7-Island Hopping",
    location: "Nueva Valencia",
    price: 450,
    rating: 4.9,
    reviews: 218,
    duration: "Full day",
    badge: "Popular",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
  },
  {
    title: "Sunset & Firefly Cruise",
    location: "Sibunag",
    price: 600,
    rating: 4.8,
    reviews: 142,
    duration: "Evening",
    badge: "New",
    gradient: "from-orange-400 via-rose-500 to-purple-600",
  },
  {
    title: "Guisi Lighthouse Day Trip",
    location: "Nueva Valencia",
    price: 1500,
    rating: 4.7,
    reviews: 96,
    duration: "Half day",
    badge: null,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    title: "Trappist Monastery & Mango Farm",
    location: "Jordan",
    price: 1200,
    rating: 4.9,
    reviews: 184,
    duration: "Half day",
    badge: "Popular",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    title: "Honda Click 125 Scooter",
    location: "Jordan Wharf pickup",
    price: 450,
    rating: 4.9,
    reviews: 312,
    duration: "Per day",
    badge: null,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
  },
  {
    title: "Private Island Picnic",
    location: "Buenavista",
    price: 3500,
    rating: 5.0,
    reviews: 47,
    duration: "Full day",
    badge: "Premium",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
  },
];

const badgeStyles: Record<string, string> = {
  Popular: "bg-cta text-cta-foreground",
  New: "bg-primary text-primary-foreground",
  Premium: "bg-slate-900 text-white",
};

export function FeaturedTours() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured this season
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Top-booked experiences in Guimaras
            </h2>
          </div>
          <p className="text-pretty text-muted-foreground sm:max-w-sm sm:text-right">
            Updated weekly based on guest reviews and bookings.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <article
              key={tour.title}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${tour.gradient}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                {tour.badge ? (
                  <Badge
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badgeStyles[tour.badge]}`}
                  >
                    {tour.badge}
                  </Badge>
                ) : null}
                <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {tour.rating}
                  <span className="text-muted-foreground">
                    ({tour.reviews})
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {tour.location}
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {tour.title}
                </h3>

                <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      from
                    </span>
                    <p className="text-xl font-bold text-foreground">
                      ₱{tour.price.toLocaleString()}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / person
                      </span>
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {tour.duration}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
