import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getIslandHoppingListingById } from "@/services/island-hopping/get";
import { updateIslandHoppingListing } from "@/services/island-hopping/update";
import { deleteIslandHoppingListing } from "@/services/island-hopping/delete";
import { CreateIslandHoppingListingSchema } from "@/types/island-hopping";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  await connection();
  const { id } = await params;

  try {
    const listing = await getIslandHoppingListingById(id);
    if (!listing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ data: listing });
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
    const listing = await updateIslandHoppingListing(id, parsed.data);
    if (!listing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ data: listing });
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
    const deleted = await deleteIslandHoppingListing(id);
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
