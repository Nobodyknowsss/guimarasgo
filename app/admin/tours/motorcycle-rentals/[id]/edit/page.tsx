import { connection } from "next/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { MotorcycleRentalForm } from "@/components/admin/motorcycle-rental-form";
import { SectionLoading } from "@/components/tours/section-loading";
import { getMotorcycleRentalListingById } from "@/services/motorcycle-rentals/get";
import {
  MOTORCYCLE_RENTALS_BUCKET,
  publicPhotoUrl,
} from "@/lib/supabase/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditBody({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const listing = await getMotorcycleRentalListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title="Edit motorcycle rental"
        description={listing.title}
      />

      <MotorcycleRentalForm
        mode="edit"
        initial={{
          id: listing.id,
          title: listing.title,
          location: listing.location,
          price: listing.price,
          price_unit: listing.price_unit,
          max_per_day: listing.max_per_day,
          description: listing.description,
          delivery: listing.delivery,
          specs: listing.specs,
          highlights: listing.highlights,
          included: listing.included,
          rental_terms: listing.rental_terms,
          photos: listing.photos.map((p) => ({
            path: p,
            url: publicPhotoUrl(MOTORCYCLE_RENTALS_BUCKET, p),
          })),
        }}
      />
    </>
  );
}

export default function EditMotorcycleRentalPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionLoading />}>
        <EditBody params={params} />
      </Suspense>
    </div>
  );
}
