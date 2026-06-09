-- Adds the bookings table and booking_status enum. A booking belongs to a user
-- (the customer) and references one listing row in its per-category table by id
-- (offering_id is a plain UUID, not a hard FK, since listings span three tables).
-- tour_title and fee are snapshotted at booking time so the record survives
-- listing edits/removal. Additive only — no data loss.

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED');

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reference" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "offering_id" UUID NOT NULL,
    "tour_title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "party_size" INTEGER NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'CONFIRMED',
    "fee_paid" BOOLEAN NOT NULL DEFAULT false,
    "fee" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_reference_key" ON "bookings"("reference");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
