import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/require-user";
import { createBooking } from "@/services/bookings/create";
import { CreateBookingSchema } from "@/types/bookings";

export async function POST(request: Request) {
  await connection();

  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "You must be logged in to book." },
      { status: auth.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid booking details.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const result = await createBooking({
      userId: auth.userId,
      userEmail: auth.email,
      input: parsed.data,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }
    return NextResponse.json(
      { data: { reference: result.reference } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not complete your booking. Please try again." },
      { status: 500 },
    );
  }
}
