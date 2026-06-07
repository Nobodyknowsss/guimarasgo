import Link from "next/link";
import { Star } from "lucide-react";

// Pure presentational reserve box used on every tour detail page. The actual
// booking flow isn't built yet — the button links to /book (which gates on
// login) carrying the selected tour for the future flow.
export function ReservePanel({
  price,
  priceUnit,
  rating,
  reserveHref,
  fee,
}: {
  price: number;
  priceUnit: string;
  /** Optional average rating. Omit to hide the rating chip. */
  rating?: number;
  reserveHref: string;
  /** The reservation fee for this tour's category, in PHP. */
  fee: number;
}) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-muted-foreground">from</span>
            <p className="text-2xl font-bold text-foreground">
              ₱{price.toLocaleString()}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {priceUnit}
              </span>
            </p>
          </div>
          {rating !== undefined ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          ) : null}
        </div>

        <Link
          href={reserveHref}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Reserve ₱{fee}
        </Link>

        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Pay the ₱{fee} reservation fee online to lock your slot. The balance is
          paid in person on arrival.
        </p>
      </div>
    </aside>
  );
}
