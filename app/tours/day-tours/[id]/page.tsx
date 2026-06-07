import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Check,
  Sparkles,
  Route,
  Navigation,
  Info,
} from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { DetailSection } from "@/components/tours/detail-section";
import { ReservePanel } from "@/components/tours/reserve-panel";
import { TourCover } from "@/components/tours/tour-cover";
import { SectionLoading } from "@/components/tours/section-loading";
import { dayToursMeta } from "@/lib/tours/day-tours";
import { getDayTourListingById } from "@/services/day-tours/get";
import { DAY_TOURS_BUCKET, publicPhotoUrl } from "@/lib/supabase/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Icon = dayToursMeta.icon;

export const metadata: Metadata = {
  title: `${dayToursMeta.label} — GuimarasGo`,
  description: dayToursMeta.intro,
};

async function DetailBody({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const tour = await getDayTourListingById(id);

  if (!tour) {
    notFound();
  }

  const cover = tour.photos[0]
    ? publicPhotoUrl(DAY_TOURS_BUCKET, tour.photos[0])
    : null;

  return (
    <main className="bg-muted/30 pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <Link
          href="/tours/day-tours"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {dayToursMeta.label}
        </Link>

        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl shadow-sm sm:aspect-[21/9]">
          <TourCover photo={cover} title={tour.title} icon={Icon} />
        </div>

        <div className="mt-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {dayToursMeta.label}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tour.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {tour.location}
            </span>
            {tour.duration ? (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {tour.duration}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-10">
            <p className="text-pretty leading-relaxed text-foreground/90">
              {tour.description}
            </p>

            {tour.highlights.length ? (
              <DetailSection icon={Sparkles} title="Highlights">
                <ul className="space-y-2.5">
                  {tour.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm text-foreground/90"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}

            {tour.stops.length ? (
              <DetailSection icon={Route} title="Stops on this tour">
                <ol className="space-y-3">
                  {tour.stops.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-foreground/90"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </DetailSection>
            ) : null}

            {tour.included.length ? (
              <DetailSection icon={Check} title="What's included">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {tour.included.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm text-foreground/90"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}

            <DetailSection icon={Navigation} title="Pickup">
              <p className="text-sm leading-relaxed text-foreground/90">
                {tour.pickup}
              </p>
            </DetailSection>

            {tour.good_to_know.length ? (
              <DetailSection icon={Info} title="Good to know">
                <ul className="space-y-2.5">
                  {tour.good_to_know.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm text-foreground/90"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}
          </div>

          <ReservePanel
            price={tour.price}
            priceUnit={tour.price_unit}
            fee={dayToursMeta.reservationFee}
            reserveHref={`/book?category=${dayToursMeta.slug}&offering=${tour.id}`}
          />
        </div>
      </div>
    </main>
  );
}

export default function DayTourDetailPage({ params }: PageProps) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <Suspense
        fallback={
          <main className="bg-muted/30 pb-16">
            <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
              <SectionLoading className="min-h-[60vh]" />
            </div>
          </main>
        }
      >
        <DetailBody params={params} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
