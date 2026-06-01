import Image from "next/image";
import { MapPin } from "lucide-react";

const destinations = [
  {
    name: "Alubihod Beach",
    municipality: "Nueva Valencia",
    blurb: "Powdery white sand and the calmest swimming cove on the island.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Pristine tropical white-sand beach with turquoise water",
  },
  {
    name: "Guisi Lighthouse",
    municipality: "Nueva Valencia",
    blurb: "Spanish-era ruins on a cliff over the Sulu Sea — sunset legend.",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Stone lighthouse ruins on a clifftop above the ocean",
  },
  {
    name: "Mango Plantations",
    municipality: "Jordan",
    blurb: "Home of the world's sweetest mangoes. Tours and tastings in season.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Lush tropical foliage of a Guimaras orchard",
  },
  {
    name: "Natago Cove",
    municipality: "Sibunag",
    blurb: "A secret bay only reachable by boat — perfect for a private picnic.",
    image:
      "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Hidden tropical cove with a small boat at golden hour",
  },
];

export function DiscoverGuimaras() {
  return (
    <section id="discover" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            The destination
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Experience Guimaras&apos; natural beauty
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            An island province of turquoise water, mango orchards, and warm
            island hospitality — just a 15-minute pumpboat from Iloilo City.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <article
              key={d.name}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={d.image}
                alt={d.imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="inline-flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  {d.municipality}
                </div>
                <h3 className="mt-1.5 text-xl font-bold leading-tight">
                  {d.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85 line-clamp-2">
                  {d.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
