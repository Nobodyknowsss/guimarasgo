"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const destinations = [
  {
    name: "Alubihod Cove",
    municipality: "Nueva Valencia",
    blurb: "Powdery white sand and the calmest swimming cove on the island.",
    image: "/guimaras-destinations/alobijod-cove-resort.webp",
    imageAlt: "White-sand cove resort on calm turquoise water",
  },
  {
    name: "Guisi Lighthouse",
    municipality: "Nueva Valencia",
    blurb: "Spanish-era ruins on a cliff over the Sulu Sea — a sunset legend.",
    image: "/guimaras-destinations/guisi-lighthouse.webp",
    imageAlt: "Stone lighthouse ruins on a clifftop above the ocean",
  },
  {
    name: "Natago Beach",
    municipality: "Sibunag",
    blurb: "A hidden bay reachable by boat — perfect for a private picnic.",
    image: "/guimaras-destinations/natago-beach.webp",
    imageAlt: "Secluded tropical beach framed by rock formations",
  },
  {
    name: "San Lorenzo Wind Farm",
    municipality: "San Lorenzo",
    blurb: "Giant turbines lining a breezy coastal ridge with sweeping views.",
    image: "/guimaras-destinations/san-lorenzo-wind-farm.webp",
    imageAlt: "Row of wind turbines along a green coastal ridge",
  },
  {
    name: "Smallest Plaza",
    municipality: "Jordan",
    blurb: "Guimaras' charming, famously tiny town plaza — a quirky photo stop.",
    image: "/guimaras-destinations/smallest-plaza.webp",
    imageAlt: "A very small public plaza with a monument",
  },
];

export function DiscoverGuimaras() {
  const [paused, setPaused] = useState(false);

  // Two copies so the track can loop seamlessly; the second is hidden from
  // screen readers to avoid announcing every destination twice.
  const loop = [...destinations, ...destinations];

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
          <p className="mt-3 text-xs text-muted-foreground/70">
            Press and hold to pause the slideshow.
          </p>
        </div>

        {/* Marquee, kept within the content width so it has space on both sides.
            The mask softly fades cards at the edges; pauses on press/hover. */}
        <div className="mt-12 overflow-hidden py-3 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]">
          <div
            className="gg-marquee flex w-max select-none"
            data-paused={paused}
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {loop.map((d, i) => (
              <article
                key={`${d.name}-${i}`}
                aria-hidden={i >= destinations.length}
                className="group relative mr-8 aspect-[3/4] w-60 shrink-0 overflow-hidden rounded-2xl shadow-md sm:w-72"
              >
                <Image
                  src={d.image}
                  alt={d.imageAlt}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="inline-flex items-center gap-1.5 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {d.municipality}
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold leading-tight">
                    {d.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/85 line-clamp-2">
                    {d.blurb}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
