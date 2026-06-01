import Link from "next/link";
import { Bike, MapPin, Star, Gauge, ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Badge } from "@/components/ui/badge";

const offerings = [
  {
    title: "Honda Click 125 Scooter",
    location: "Jordan Wharf pickup",
    price: 450,
    rating: 4.9,
    reviews: 312,
    perDay: true,
    description:
      "The all-rounder. Light, easy to ride, great fuel economy. Helmets and phone holder included.",
    badge: "Popular",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
  },
  {
    title: "Yamaha Mio 125 Scooter",
    location: "Jordan Wharf pickup",
    price: 400,
    rating: 4.8,
    reviews: 248,
    perDay: true,
    description:
      "Compact and forgiving — a good first-rental pick. Smooth automatic gearbox, room for two.",
    badge: null,
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
  },
  {
    title: "Honda XR150L Adventure",
    location: "Delivered to your stay",
    price: 700,
    rating: 4.9,
    reviews: 96,
    perDay: true,
    description:
      "For the off-the-beaten-track riders. Manual, taller saddle, handles dirt roads with no drama.",
    badge: "New",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    title: "Honda ADV160 Premium",
    location: "Delivered to your stay",
    price: 900,
    rating: 5.0,
    reviews: 41,
    perDay: true,
    description:
      "Big-wheel adventure scooter. Comfortable for long days, two-up friendly, top-box included.",
    badge: "Premium",
    gradient: "from-slate-700 via-slate-900 to-black",
  },
];

const badgeStyles: Record<string, string> = {
  Popular: "bg-cta text-cta-foreground",
  New: "bg-primary text-primary-foreground",
  Premium: "bg-slate-900 text-white",
};

export default function MotorcycleRentalsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-muted/30 pt-24 pb-12 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#tours"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all categories
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Bike className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Motorcycle Rentals
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore Guimaras at your own pace
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              Well-maintained scooters and adventure bikes, delivered to your
              wharf or accommodation. Reserve for ₱100 — pay the balance on
              arrival.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {offerings.map((o) => (
                <article
                  key={o.title}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${o.gradient}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                    {o.badge ? (
                      <Badge
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badgeStyles[o.badge]}`}
                      >
                        {o.badge}
                      </Badge>
                    ) : null}
                    <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {o.rating}
                      <span className="text-muted-foreground">
                        ({o.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {o.location}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {o.description}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          from
                        </span>
                        <p className="text-xl font-bold text-foreground">
                          ₱{o.price.toLocaleString()}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            / day
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Gauge className="h-3.5 w-3.5" />
                          {o.perDay ? "Daily rental" : "Single use"}
                        </span>
                        <Link
                          href="/book"
                          className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        >
                          Reserve ₱100
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
