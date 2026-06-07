import { connection } from "next/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { IslandHoppingForm } from "@/components/admin/island-hopping-form";
import { SectionLoading } from "@/components/tours/section-loading";
import { getIslandHoppingListingById } from "@/services/island-hopping/get";
import { ISLAND_HOPPING_BUCKET, publicPhotoUrl } from "@/lib/supabase/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditBody({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const listing = await getIslandHoppingListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title="Edit island hopping tour"
        description={listing.title}
      />

      <IslandHoppingForm
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
          meeting_point: listing.meeting_point,
          highlights: listing.highlights,
          islands: listing.islands,
          included: listing.included,
          good_to_know: listing.good_to_know,
          photos: listing.photos.map((p) => ({
            path: p,
            url: publicPhotoUrl(ISLAND_HOPPING_BUCKET, p),
          })),
        }}
      />
    </>
  );
}

export default function EditIslandHoppingPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionLoading />}>
        <EditBody params={params} />
      </Suspense>
    </div>
  );
}
