"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Users, Lock, ShieldCheck, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type Props = {
  initial: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    fbLink: string;
  };
  offering: {
    category: string;
    offeringId: string;
    title: string;
    categoryLabel: string;
    fee: number;
    price: number;
    priceUnit: string;
  };
};

// Local today (yyyy-mm-dd) used to block past dates in the picker. The server
// re-checks against Philippine time, so this is just a UX guardrail.
function localToday(): string {
  return new Date().toLocaleDateString("en-CA");
}

function formatLongDate(yyyatmmdd: string): string {
  const d = new Date(`${yyyatmmdd}T00:00:00`);
  if (Number.isNaN(d.getTime())) return yyyatmmdd;
  return d.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BookingForm({ initial, offering }: Props) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [fbLink, setFbLink] = useState(initial.fbLink);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");

  const [formError, setFormError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Validate, then open the confirmation dialog (no booking happens yet).
  const handleReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setFormError("Please fill in your name and phone number.");
      return;
    }
    if (!date) {
      setFormError("Please choose a tour date.");
      return;
    }
    if (date < localToday()) {
      setFormError("The tour date can't be in the past.");
      return;
    }
    const n = Number(guests);
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      setFormError("Enter a number of guests between 1 and 50.");
      return;
    }

    setDialogError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: offering.category,
            offeringId: offering.offeringId,
            date,
            partySize: Number(guests),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            fbLink: fbLink.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setDialogError(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        setConfirmOpen(false);
        setConfirmedRef(data.data.reference);
        router.refresh();
      } catch {
        setDialogError("Network error. Please try again.");
      }
    });
  };

  // ── Success state ──────────────────────────────────────────────────────
  if (confirmedRef) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CircleCheck className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          Booking confirmed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re booked for{" "}
          <span className="font-medium text-foreground">{offering.title}</span>{" "}
          on {formatLongDate(date)}.
        </p>
        <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
          Reference
        </p>
        <p className="font-mono text-lg font-semibold text-foreground">
          {confirmedRef}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-pretty text-sm text-muted-foreground">
          Pay the ₱{offering.fee.toLocaleString()} reservation fee and the ₱
          {offering.price.toLocaleString()} balance in person on arrival. Online
          payment is launching soon.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/bookings"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            My bookings
          </Link>
          <Link
            href="/#tours"
            className="inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            Browse more
          </Link>
        </div>
      </div>
    );
  }

  // ── Booking form ───────────────────────────────────────────────────────
  return (
    <>
      <form onSubmit={handleReview} className="space-y-6">
        {/* Trip details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Trip details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick your date and how many are coming.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                Tour date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                min={localToday()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guests" className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Guests
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                required
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact details — saved to the customer's account */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Your details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll use these to confirm your reservation. Changes here update
            your account.
          </p>

          <div className="mt-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                Email
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input
                id="email"
                type="email"
                value={initial.email}
                readOnly
                disabled
                className="cursor-not-allowed bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Email is locked — it&apos;s how you sign in.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fbLink">
                Facebook link{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="fbLink"
                name="fbLink"
                type="url"
                placeholder="https://facebook.com/your.profile"
                value={fbLink}
                onChange={(e) => setFbLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            No payment is taken now. The ₱{offering.fee.toLocaleString()}{" "}
            reservation fee and the ₱{offering.price.toLocaleString()} balance are
            paid in person on arrival — online payment is launching soon.
          </p>
        </div>

        {formError ? (
          <p className="text-sm text-red-500">{formError}</p>
        ) : null}

        <Button type="submit" className="h-11 w-full text-base">
          Book now
        </Button>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your booking</AlertDialogTitle>
            <AlertDialogDescription>
              Please review before we lock in your slot. No payment is taken now.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <dl className="space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tour</dt>
              <dd className="text-right font-medium text-foreground">
                {offering.title}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="text-right text-foreground">
                {offering.categoryLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-right text-foreground">
                {date ? formatLongDate(date) : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="text-right text-foreground">{guests}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="font-medium text-foreground">Reservation fee</dt>
              <dd className="text-right font-semibold text-foreground">
                ₱{offering.fee.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (pay on arrival)
                </span>
              </dd>
            </div>
          </dl>

          {dialogError ? (
            <p className="text-sm text-red-500">{dialogError}</p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Go back</AlertDialogCancel>
            <Button type="button" onClick={handleConfirm} disabled={pending}>
              {pending ? "Confirming..." : "Confirm booking"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
