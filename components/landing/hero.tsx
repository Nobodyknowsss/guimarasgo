import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sailboat, Sun, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceChips = [
  { href: "/tours", label: "Island Hopping", icon: Sailboat },
  { href: "/tours", label: "Day Tours", icon: Sun },
  { href: "/tours", label: "Motorcycle Rentals", icon: Bike },
];

export function Hero() {
  return (
    <section className="relative isolate min-h-[640px] overflow-hidden pt-16 md:min-h-[720px]">
      {/* Background photo */}
      <Image
        src="/guimarasgo.webp"
        alt="Crystal-clear waters and limestone cliffs of Guimaras Island"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Overlay for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/55 via-slate-900/35 to-slate-950/65"
      />

      <div className="mx-auto flex min-h-[640px] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 md:min-h-[720px] lg:px-8">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Discover Guimaras, Philippines
        </span>

        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Your perfect island adventure,{" "}
          <span className="text-secondary">booked in minutes</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-white/85 sm:text-lg">
          Island-hopping, day tours, and motorcycle rentals — all locally run by
          GuimarasGo. Reserve your spot with a small fee, pay the rest on
          arrival.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group h-12 cursor-pointer bg-white px-7 text-base text-primary shadow-lg shadow-black/20 transition-all hover:bg-white/95 hover:shadow-xl hover:shadow-black/30"
          >
            <Link href="/tours">
              Explore tours
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {serviceChips.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/20"
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:flex"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <span className="h-8 w-px animate-pulse bg-white/50" />
      </div>
    </section>
  );
}
