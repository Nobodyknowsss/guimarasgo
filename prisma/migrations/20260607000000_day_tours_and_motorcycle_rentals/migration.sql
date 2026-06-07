-- Adds the day_tour_listings and motorcycle_rental_listings tables (parallel to
-- island_hopping_listings) and backfills island_hopping_listings with the two
-- richer detail fields (duration, good_to_know) so all three tour types share a
-- consistent shape. Additive only — no data loss.

-- AlterTable
ALTER TABLE "island_hopping_listings" ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "good_to_know" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "day_tour_listings" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" INTEGER NOT NULL,
    "price_unit" TEXT NOT NULL,
    "max_per_day" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stops" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pickup" TEXT NOT NULL,
    "good_to_know" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "day_tour_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_rental_listings" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" INTEGER NOT NULL,
    "price_unit" TEXT NOT NULL,
    "max_per_day" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "specs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delivery" TEXT NOT NULL,
    "rental_terms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "motorcycle_rental_listings_pkey" PRIMARY KEY ("id")
);
