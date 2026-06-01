import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/stat-card";
import { TourForm } from "@/components/admin/tour-form";
import { adminListings } from "@/lib/admin/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return adminListings.map((listing) => ({ slug: listing.slug }));
}

export default async function EditTourPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = adminListings.find((l) => l.slug === slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to tours
      </Link>
      <AdminPageHeader
        title="Edit tour"
        description={`${listing.categoryLabel} · ${listing.title}`}
      />
      <TourForm
        mode="edit"
        initial={{
          category: listing.category,
          title: listing.title,
          price: listing.price,
          priceUnit: listing.priceUnit,
          maxPerDay: listing.maxPerDay,
          badge: listing.badge,
          rating: listing.rating,
          reviews: listing.reviews,
          shortDescription: listing.shortDescription,
          active: listing.active,
        }}
      />
    </div>
  );
}
