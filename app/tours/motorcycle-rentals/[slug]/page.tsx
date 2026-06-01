import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Gauge,
  Check,
  Sparkles,
  Truck,
  ScrollText,
} from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Badge } from "@/components/ui/badge";
import { DetailSection } from "@/components/tours/detail-section";
import { ReservePanel } from "@/components/tours/reserve-panel";
import { badgeStyles } from "@/lib/tours/shared";
import {
  motorcycleRentalsMeta,
  motorcycleRentals,
  getMotorcycleRental,
} from "@/lib/tours/motorcycle-rentals";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return motorcycleRentals.map((rental) => ({ slug: rental.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rental = getMotorcycleRental(slug);
  if (!rental) return { title: "Motorcycle Rental — GuimarasGo" };
  return {
    title: `${rental.title} — GuimarasGo`,
    description: rental.shortDescription,
  };
}

export default async function MotorcycleRentalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rental = getMotorcycleRental(slug);

  if (!rental) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-muted/30 pb-16">
        <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <Link
            href="/tours/motorcycle-rentals"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {motorcycleRentalsMeta.label}
          </Link>

          <div
            className={`relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm sm:aspect-[21/9] ${rental.gradient}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
            {rental.badge ? (
              <Badge
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-md ${badgeStyles[rental.badge]}`}
              >
                {rental.badge}
              </Badge>
            ) : null}
            <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {rental.rating}
              <span className="text-muted-foreground">({rental.reviews} reviews)</span>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {motorcycleRentalsMeta.label}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {rental.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {rental.location}
              </span>
              {rental.specs[0] ? (
                <span className="inline-flex items-center gap-1.5">
                  <Gauge className="h-4 w-4" />
                  {rental.specs[0].value}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="space-y-10">
              <p className="text-pretty leading-relaxed text-foreground/90">
                {rental.overview}
              </p>

              <DetailSection icon={Gauge} title="Bike specs">
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {rental.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-border bg-card p-3 text-center"
                    >
                      <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </DetailSection>

              <DetailSection icon={Sparkles} title="Highlights">
                <ul className="space-y-2.5">
                  {rental.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection icon={Check} title="What's included">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {rental.included.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection icon={Truck} title="Pickup & delivery">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {rental.delivery}
                </p>
              </DetailSection>

              <DetailSection icon={ScrollText} title="Rental terms">
                <ul className="space-y-2.5">
                  {rental.rentalTerms.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            </div>

            <ReservePanel
              price={rental.pricePerDay}
              priceUnit={motorcycleRentalsMeta.priceUnit}
              rating={rental.rating}
              fee={motorcycleRentalsMeta.reservationFee}
              reserveHref={`/book?category=${motorcycleRentalsMeta.slug}&offering=${rental.slug}`}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
