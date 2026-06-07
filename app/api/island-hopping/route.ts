import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getIslandHoppingListings } from "@/services/island-hopping/get";
import { createIslandHoppingListing } from "@/services/island-hopping/create";
import { CreateIslandHoppingListingSchema } from "@/types/island-hopping";
import { ISLAND_HOPPING_BUCKET, withPublicPhotos } from "@/lib/supabase/storage";

export async function GET() {
  await connection();

  try {
    const listings = await getIslandHoppingListings();
    return NextResponse.json({
      data: listings.map((l) => withPublicPhotos(ISLAND_HOPPING_BUCKET, l)),
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

  const parsed = CreateIslandHoppingListingSchema.safeParse(body);
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
    const listing = await createIslandHoppingListing(parsed.data);
    return NextResponse.json(
      { data: withPublicPhotos(ISLAND_HOPPING_BUCKET, listing) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create listing." },
      { status: 500 },
    );
  }
}
