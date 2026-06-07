import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { DayTourForm } from "@/components/admin/day-tour-form";
import { SectionLoading } from "@/components/tours/section-loading";
import { getDayTourListingById } from "@/services/day-tours/get";
import { DAY_TOURS_BUCKET, publicPhotoUrl } from "@/lib/supabase/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditBody({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const listing = await getDayTourListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader title="Edit day tour" description={listing.title} />

      <DayTourForm
        mode="edit"
        initial={{
          id: listing.id,
          title: listing.title,
          location: listing.location,
          price: listing.price,
          price_unit: listing.price_unit,
          max_per_day: listing.max_per_day,
          duration: listing.duration,
          description: listing.description,
          pickup: listing.pickup,
          highlights: listing.highlights,
          stops: listing.stops,
          included: listing.included,
          good_to_know: listing.good_to_know,
          photos: listing.photos.map((p) => ({
            path: p,
            url: publicPhotoUrl(DAY_TOURS_BUCKET, p),
          })),
        }}
      />
    </>
  );
}

export default function EditDayTourPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to tours
      </Link>

      <Suspense fallback={<SectionLoading />}>
        <EditBody params={params} />
      </Suspense>
    </div>
  );
}
