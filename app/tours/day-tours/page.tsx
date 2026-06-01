import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Star, Users, ArrowLeft, ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Badge } from "@/components/ui/badge";
import { badgeStyles } from "@/lib/tours/shared";
import { dayToursMeta, dayTours } from "@/lib/tours/day-tours";

export const metadata: Metadata = {
  title: `${dayToursMeta.label} — GuimarasGo`,
  description: dayToursMeta.intro,
};

const Icon = dayToursMeta.icon;

export default function DayToursPage() {
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
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                {dayToursMeta.label}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {dayToursMeta.title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              {dayToursMeta.intro}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {dayTours.map((tour) => (
                <Link
                  key={tour.slug}
                  href={`/tours/day-tours/${tour.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${tour.gradient}`}
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
                      <span className="text-muted-foreground">({tour.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {tour.location}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {tour.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {tour.shortDescription}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">from</span>
                        <p className="text-xl font-bold text-foreground">
                          ₱{tour.price.toLocaleString()}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            / {dayToursMeta.priceUnit}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {tour.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          More Details
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
