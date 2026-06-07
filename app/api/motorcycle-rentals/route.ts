import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getMotorcycleRentalListings } from "@/services/motorcycle-rentals/get";
import { createMotorcycleRentalListing } from "@/services/motorcycle-rentals/create";
import { CreateMotorcycleRentalListingSchema } from "@/types/motorcycle-rentals";
import {
  MOTORCYCLE_RENTALS_BUCKET,
  withPublicPhotos,
} from "@/lib/supabase/storage";

export async function GET() {
  await connection();

  try {
    const listings = await getMotorcycleRentalListings();
    return NextResponse.json({
      data: listings.map((l) => withPublicPhotos(MOTORCYCLE_RENTALS_BUCKET, l)),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch listings." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await connection();

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: auth.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = CreateMotorcycleRentalListingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const listing = await createMotorcycleRentalListing(parsed.data);
    return NextResponse.json(
      { data: withPublicPhotos(MOTORCYCLE_RENTALS_BUCKET, listing) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create listing." },
      { status: 500 },
    );
  }
}
