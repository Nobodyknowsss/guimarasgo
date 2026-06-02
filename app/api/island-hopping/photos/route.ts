import { connection } from "next/server";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { uploadIslandHoppingPhoto } from "@/services/island-hopping/upload-photo";
import {
  ALLOWED_PHOTO_MIME_TYPES,
  MAX_PHOTO_BYTES,
} from "@/lib/supabase/storage";

// POST /api/island-hopping/photos
// Admin-only. Accepts multipart/form-data with a single `file`, uploads it to
// Supabase Storage, and returns:
//   { "path": "<uuid>.jpg", "url": "https://.../island-hopping/<uuid>.jpg" }
// Save `path` in the listing's photos[]; use `url` for an immediate UI preview.
export async function POST(request: Request) {
  await connection();

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: auth.status },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'file' field." },
      { status: 400 },
    );
  }
  if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, or WebP images are allowed." },
      { status: 415 },
    );
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 4MB)." },
      { status: 413 },
    );
  }

  try {
    const photo = await uploadIslandHoppingPhoto(file);
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
