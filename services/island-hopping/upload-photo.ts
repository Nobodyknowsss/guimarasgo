import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ISLAND_HOPPING_BUCKET,
  extForMime,
  publicPhotoUrl,
} from "@/lib/supabase/storage";

export interface UploadedPhoto {
  /** Storage path — this is what gets saved in a listing's photos[]. */
  path: string;
  /** Public URL — for previewing the just-uploaded image in the UI. */
  url: string;
}

// Uploads a single photo to the island-hopping bucket and returns both its
// storage PATH (for the DB) and its public URL (for an immediate preview). Uses
// the service-role client, which bypasses Storage RLS — so the caller MUST
// authorize the request first (the route does this via requireAdmin).
export async function uploadIslandHoppingPhoto(
  file: File,
): Promise<UploadedPhoto> {
  const admin = createSupabaseAdminClient();
  const path = `${crypto.randomUUID()}.${extForMime(file.type)}`;
  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage
    .from(ISLAND_HOPPING_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) throw error;
  return { path, url: publicPhotoUrl(path) };
}
