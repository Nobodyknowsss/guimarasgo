import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getDayTourListingById } from "@/services/day-tours/get";
import { updateDayTourListing } from "@/services/day-tours/update";
import { deleteDayTourListing } from "@/services/day-tours/delete";
import { CreateDayTourListingSchema } from "@/types/day-tours";
import { DAY_TOURS_BUCKET, withPublicPhotos } from "@/lib/supabase/storage";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  await connection();
  const { id } = await params;

  try {
    const listing = await getDayTourListingById(id);
    if (!listing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({
      data: withPublicPhotos(DAY_TOURS_BUCKET, listing),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch listing." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  await connection();
  const { id } = await params;

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

  const parsed = CreateDayTourListingSchema.safeParse(body);
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
    const listing = await updateDayTourListing(id, parsed.data);
    if (!listing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({
      data: withPublicPhotos(DAY_TOURS_BUCKET, listing),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update listing." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  await connection();
  const { id } = await params;

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: auth.status },
    );
  }

  try {
    const deleted = await deleteDayTourListing(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete listing." },
      { status: 500 },
    );
  }
}
