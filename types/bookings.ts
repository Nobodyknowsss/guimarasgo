import { z } from "zod";

// Booking categories are the tour-type slugs the Reserve links carry and what we
// persist on Booking.category.
export const BOOKING_CATEGORIES = [
  "island-hopping",
  "day-tours",
  "motorcycle-rentals",
] as const;

// POST /api/bookings body. Contact fields mirror the /account profile rules; the
// server saves them back to the user and snapshots the rest onto the booking.
export const CreateBookingSchema = z.object({
  category: z.enum(BOOKING_CATEGORIES),
  offeringId: z.string().uuid("Invalid listing."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid tour date."),
  partySize: z
    .number()
    .int()
    .min(1, "Enter a number of guests between 1 and 50.")
    .max(50, "Enter a number of guests between 1 and 50."),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name is too long."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .max(40, "Phone number is too long."),
  fbLink: z.string().trim().max(255, "Facebook link is too long.").optional(),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

// Statuses as the admin UI uses them (lowercase). Mapped to the Prisma enum in
// the service layer.
export const BOOKING_STATUSES = ["confirmed", "pending", "cancelled"] as const;

// PATCH /api/bookings/[id] body.
export const UpdateBookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});

export type UpdateBookingStatus = z.infer<typeof UpdateBookingStatusSchema>;
