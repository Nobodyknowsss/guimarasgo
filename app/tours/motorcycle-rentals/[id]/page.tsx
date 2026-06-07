import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Check,
  Sparkles,
  Truck,
  ScrollText,
} from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { DetailSection } from "@/components/tours/detail-section";
import { ReservePanel } from "@/components/tours/reserve-panel";
import { TourCover } from "@/components/tours/tour-cover";
import { SectionLoading } from "@/components/tours/section-loading";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";
import { getMotorcycleRentalListingById } from "@/services/motorcycle-rentals/get";
import {
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Icon = motorcycleRentalsMeta.icon;

// Specs are stored flattened as "Label: Value"; split for the labelled grid.
function splitSpec(spec: string): { label: string; value: string } {
  const i = spec.indexOf(":");
  if (i === -1) return { label: "", value: spec.trim() };
  return { label: spec.slice(0, i).trim(), value: spec.slice(i + 1).trim() };
}

export const metadata: Metadata = {
  title: `${motorcycleRentalsMeta.label} — GuimarasGo`,
  description: motorcycleRentalsMeta.intro,
};

async function DetailBody({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const rental = await getMotorcycleRentalListingById(id);

  if (!rental) {
    notFound();
  }

  const cover = rental.photos[0]
    ? publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, rental.photos[0])
    : null;
  const specs = rental.specs.map(splitSpec);

  return (
    <main className="bg-muted/30 pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <Link
          href="/tours/motorcycle-rentals"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {motorcycleRentalsMeta.label}
        </Link>

        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl shadow-sm sm:aspect-[21/9]">
          <TourCover photo={cover} title={rental.title} icon={Icon} />
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
            {specs[0] ? (
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="h-4 w-4" />
                {specs[0].value}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-10">
            <p className="text-pretty leading-relaxed text-foreground/90">
              {rental.description}
            </p>

            {specs.length ? (
              <DetailSection icon={Gauge} title="Bike specs">
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {specs.map((spec, i) => (
                    <div
                      key={`${spec.label}-${i}`}
                      className="rounded-xl border border-border bg-card p-3 text-center"
                    >
                      {spec.label ? (
                        <dt className="text-xs text-muted-foreground">
                          {spec.label}
                        </dt>
                      ) : null}
                      <dd className="mt-1 text-sm font-semibold text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </DetailSection>
            ) : null}

            {rental.highlights.length ? (
              <DetailSection icon={Sparkles} title="Highlights">
                <ul className="space-y-2.5">
                  {rental.highlights.map((item) => (
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

            {rental.included.length ? (
              <DetailSection icon={Check} title="What's included">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {rental.included.map((item) => (
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

            <DetailSection icon={Truck} title="Pickup & delivery">
              <p className="text-sm leading-relaxed text-foreground/90">
                {rental.delivery}
              </p>
            </DetailSection>

            {rental.rental_terms.length ? (
              <DetailSection icon={ScrollText} title="Rental terms">
                <ul className="space-y-2.5">
                  {rental.rental_terms.map((item) => (
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
            price={rental.price}
            priceUnit={rental.price_unit}
            fee={motorcycleRentalsMeta.reservationFee}
            reserveHref={`/book?category=${motorcycleRentalsMeta.slug}&offering=${rental.id}`}
          />
        </div>
      </div>
    </main>
  );
}

export default function MotorcycleRentalDetailPage({ params }: PageProps) {
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
