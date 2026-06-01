import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getIslandHoppingListings } from "@/services/island-hopping/get";

export async function GET() {
  await connection();

  try {
    const listings = await getIslandHoppingListings();
    return NextResponse.json({ data: listings });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch listings." },
      { status: 500 },
    );
  }
}
