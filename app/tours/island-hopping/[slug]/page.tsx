import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Check,
  Sparkles,
  Anchor,
  Navigation,
  Info,
} from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Badge } from "@/components/ui/badge";
import { DetailSection } from "@/components/tours/detail-section";
import { ReservePanel } from "@/components/tours/reserve-panel";
import { badgeStyles } from "@/lib/tours/shared";
import {
  islandHoppingMeta,
  islandHoppingTours,
  getIslandHoppingTour,
} from "@/lib/tours/island-hopping";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return islandHoppingTours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getIslandHoppingTour(slug);
  if (!tour) return { title: "Tour — GuimarasGo" };
  return { title: `${tour.title} — GuimarasGo`, description: tour.shortDescription };
}

export default async function IslandHoppingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getIslandHoppingTour(slug);

  if (!tour) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-muted/30 pb-16">
        <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <Link
            href="/tours/island-hopping"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {islandHoppingMeta.label}
          </Link>

          <div
            className={`relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm sm:aspect-[21/9] ${tour.gradient}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
            {tour.badge ? (
              <Badge
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badgeStyles[tour.badge]}`}
              >
                {tour.badge}
              </Badge>
            ) : null}
            <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {tour.rating}
              <span className="text-muted-foreground">({tour.reviews} reviews)</span>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {islandHoppingMeta.label}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {tour.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {tour.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {tour.duration}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="space-y-10">
              <p className="text-pretty leading-relaxed text-foreground/90">
                {tour.overview}
              </p>

              <DetailSection icon={Sparkles} title="Highlights">
                <ul className="space-y-2.5">
                  {tour.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection icon={Anchor} title="Islands you'll visit">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {tour.islands.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection icon={Check} title="What's included">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {tour.included.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection icon={Navigation} title="Meeting point">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {tour.meetingPoint}
                </p>
              </DetailSection>

              <DetailSection icon={Info} title="Good to know">
                <ul className="space-y-2.5">
                  {tour.goodToKnow.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            </div>

            <ReservePanel
              price={tour.price}
              priceUnit={islandHoppingMeta.priceUnit}
              rating={tour.rating}
              fee={islandHoppingMeta.reservationFee}
              reserveHref={`/book?category=${islandHoppingMeta.slug}&offering=${tour.slug}`}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
