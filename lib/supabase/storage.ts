import { createClient } from "@supabase/supabase-js";

// Public buckets holding listing photos, one per tour type. We store only the
// storage path per photo in Postgres and derive the public URL on read. Because
// the buckets are public, the URLs are stable and need no auth or expiry.
export const ISLAND_HOPPING_BUCKET = "island-hopping";
export const DAY_TOURS_BUCKET = "day-tours";
export const MOTORCYCLE_RENTALS_BUCKET = "motorcycle-rentals";

// Upload constraints. 4MB keeps a single request safely under Vercel's ~4.5MB
// serverless body cap (the file is proxied through our route handler).
export const ALLOWED_PHOTO_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** File extension for a given (already-validated) image mime type. */
export function extForMime(mime: string): string {
  return EXT_BY_MIME[mime] ?? "bin";
}

// getPublicUrl is pure string-building (no network call), so a keyless-ish client
// with the publishable key is all we need here.
const storage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
).storage;

/** Maps a stored storage path to its public, displayable URL. */
export function publicPhotoUrl(bucket: string, path: string): string {
  return storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Returns a copy of a listing with its stored photo *paths* mapped to public
 * URLs. Listings carry paths in the DB; consumers want displayable URLs, so call
 * this at the read edge (API responses, public pages, admin edit previews).
 */
export function withPublicPhotos<T extends { photos: string[] }>(
  bucket: string,
  listing: T,
): T {
  return { ...listing, photos: listing.photos.map((p) => publicPhotoUrl(bucket, p)) };
}
