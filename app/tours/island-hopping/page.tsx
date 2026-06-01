import Link from "next/link";
import { Sailboat, MapPin, Star, Users, ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Badge } from "@/components/ui/badge";

const offerings = [
  {
    title: "Classic 7-Island Hopping",
    location: "Nueva Valencia",
    price: 450,
    rating: 4.9,
    reviews: 218,
    duration: "Full day",
    description:
      "The signature loop through Ave Maria, Natago, Turtle, and four more islands. Snorkel gear and lunch on the boat included.",
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
    description:
      "Slow cruise through the mangroves at golden hour, then drift past fireflies in the dark. Best with a small group.",
    badge: "New",
    gradient: "from-orange-400 via-rose-500 to-purple-600",
  },
  {
    title: "Snorkel & Reef Half-Day",
    location: "Nueva Valencia",
    price: 750,
    rating: 4.7,
    reviews: 86,
    duration: "Half day",
    description:
      "Two of the island's best reef spots, plus a beach stop for lunch. Gear, guide, and a packed bento included.",
    badge: null,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    title: "Private Island Picnic",
    location: "Buenavista",
    price: 3500,
    rating: 5.0,
    reviews: 47,
    duration: "Full day",
    description:
      "Your own boat, your own crew, your own cove. Tailored stops, fresh seafood lunch grilled on the beach.",
    badge: "Premium",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
  },
];

const badgeStyles: Record<string, string> = {
  Popular: "bg-cta text-cta-foreground",
  New: "bg-primary text-primary-foreground",
  Premium: "bg-slate-900 text-white",
};

export default function IslandHoppingPage() {
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
                <Sailboat className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Island Hopping
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Hop between Guimaras&apos; best-kept islands
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              From the classic 7-island circuit to private picnic charters,
              every trip is run by GuimarasGo&apos;s local boatmen. Reserve a
              slot for ₱100 — pay the balance on arrival.
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
                            / person
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {o.duration}
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
