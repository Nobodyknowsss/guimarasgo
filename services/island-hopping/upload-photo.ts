import { ISLAND_HOPPING_BUCKET } from "@/lib/supabase/storage";
import { uploadListingPhoto, type UploadedPhoto } from "@/lib/supabase/upload";

// Thin wrapper that pins the island-hopping bucket. See lib/supabase/upload.
export function uploadIslandHoppingPhoto(file: File): Promise<UploadedPhoto> {
  return uploadListingPhoto(ISLAND_HOPPING_BUCKET, file);
}

export type { UploadedPhoto };
