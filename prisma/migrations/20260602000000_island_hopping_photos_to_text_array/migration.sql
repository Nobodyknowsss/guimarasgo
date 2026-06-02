-- island_hopping_listings.photos: jsonb ({ url, publicId }[]) -> text[] of Supabase Storage paths.
-- Existing photo data is throwaway mock data, so the column is recreated rather than cast
-- (jsonb does not cast cleanly to text[]).
ALTER TABLE "island_hopping_listings" DROP COLUMN "photos";
ALTER TABLE "island_hopping_listings" ADD COLUMN "photos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
