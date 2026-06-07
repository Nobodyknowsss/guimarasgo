import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extForMime, publicPhotoUrl } from "@/lib/supabase/storage";

export interface UploadedPhoto {
  /** Storage path — this is what gets saved in a listing's photos[]. */
  path: string;
  /** Public URL — for previewing the just-uploaded image in the UI. */
  url: string;
}

// Uploads a single (already-validated) photo to the given public bucket and
// returns both its storage PATH (for the DB) and its public URL (for an immediate
// preview). Uses the service-role client, which bypasses Storage RLS — so the
// caller MUST authorize the request first (the routes do this via requireAdmin).
export async function uploadListingPhoto(
  bucket: string,
  file: File,
): Promise<UploadedPhoto> {
  const admin = createSupabaseAdminClient();
  const path = `${crypto.randomUUID()}.${extForMime(file.type)}`;
  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) throw error;
  return { path, url: publicPhotoUrl(bucket, path) };
}
