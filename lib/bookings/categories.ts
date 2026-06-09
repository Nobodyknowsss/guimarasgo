import { islandHoppingMeta } from "@/lib/tours/island-hopping";
import { dayToursMeta } from "@/lib/tours/day-tours";
import { motorcycleRentalsMeta } from "@/lib/tours/motorcycle-rentals";

// One place to resolve a booking's category slug to its display label and
// reservation fee. The slug is what the Reserve links carry (?category=) and what
// we persist on Booking.category, so this keeps /book, the booking action, and the
// admin screens in agreement on labels and fees.
export const bookingCategoryMeta: Record<
  string,
  { label: string; fee: number }
> = {
  [islandHoppingMeta.slug]: {
    label: islandHoppingMeta.label,
    fee: islandHoppingMeta.reservationFee,
  },
  [dayToursMeta.slug]: {
    label: dayToursMeta.label,
    fee: dayToursMeta.reservationFee,
  },
  [motorcycleRentalsMeta.slug]: {
    label: motorcycleRentalsMeta.label,
    fee: motorcycleRentalsMeta.reservationFee,
  },
};

/** Human label for a category slug, falling back to the slug itself. */
export function categoryLabel(slug: string): string {
  return bookingCategoryMeta[slug]?.label ?? slug;
}
