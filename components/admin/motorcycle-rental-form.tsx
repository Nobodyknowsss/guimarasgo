"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  StringListField,
  textareaClass,
} from "@/components/admin/string-list-field";

const CATEGORY = "motorcycle-rentals";

export interface MotorcycleRentalFormInitial {
  id: string;
  title: string;
  location: string;
  price: number;
  price_unit: string;
  max_per_day: number;
  description: string;
  delivery: string;
  specs: string[];
  highlights: string[];
  included: string[];
  rental_terms: string[];
  /** Existing photos as { storage path, public url } pairs. */
  photos: { path: string; url: string }[];
}

const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
const orOne = (arr: string[]) => (arr.length ? arr : [""]);

// Create/edit form for Motorcycle Rental listings. Priced per day; the
// type-specific fields are the bike specs (a flattened "Label: Value" list),
// delivery details, and rental terms.
export function MotorcycleRentalForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: MotorcycleRentalFormInitial;
}) {
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>(
    initial?.photos.map((p) => p.path) ?? [],
  );
  const [specs, setSpecs] = useState<string[]>(orOne(initial?.specs ?? []));
  const [highlights, setHighlights] = useState<string[]>(
    orOne(initial?.highlights ?? []),
  );
  const [included, setIncluded] = useState<string[]>(
    orOne(initial?.included ?? []),
  );
  const [rentalTerms, setRentalTerms] = useState<string[]>(
    orOne(initial?.rental_terms ?? []),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      category: CATEGORY,
      title: String(fd.get("title") ?? "").trim(),
      location: String(fd.get("location") ?? "").trim(),
      photos,
      price: Number(fd.get("price")),
      price_unit: String(fd.get("price_unit") ?? "").trim() || "day",
      max_per_day: Number(fd.get("max_per_day")),
      description: String(fd.get("description") ?? "").trim(),
      specs: clean(specs),
      highlights: clean(highlights),
      included: clean(included),
      delivery: String(fd.get("delivery") ?? "").trim(),
      rental_terms: clean(rentalTerms),
    };

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        mode === "edit" ? `/api/${CATEGORY}/${initial!.id}` : `/api/${CATEGORY}`,
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/tours");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initial?.title}
          placeholder="e.g. Honda Click 125 Scooter"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={initial?.location}
          placeholder="e.g. Jordan Wharf pickup"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Photos (up to 6)</Label>
        <ImageUploader
          endpoint={`/api/${CATEGORY}/photos`}
          max={6}
          initial={initial?.photos}
          onChange={setPhotos}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Price / day (₱)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            defaultValue={initial?.price}
            placeholder="450"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price_unit">Price unit</Label>
          <Input
            id="price_unit"
            name="price_unit"
            defaultValue={initial?.price_unit ?? "day"}
            placeholder="day"
          />
        </div>
      </div>

      <div className="grid gap-2 sm:max-w-[14rem]">
        <Label htmlFor="max_per_day">Max bookings / day</Label>
        <Input
          id="max_per_day"
          name="max_per_day"
          type="number"
          min={1}
          defaultValue={initial?.max_per_day}
          placeholder="8"
          required
        />
        <p className="text-xs text-muted-foreground">
          How many of this bike can be rented out in a single day.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description}
          placeholder="What the bike is and who it's best for."
          className={textareaClass}
          required
        />
      </div>

      <StringListField
        label="Specs"
        addLabel="Add spec"
        placeholder="e.g. Transmission: Automatic"
        values={specs}
        onChange={setSpecs}
      />

      <StringListField
        label="Highlights"
        addLabel="Add highlight"
        placeholder="e.g. Light, automatic, and beginner-friendly"
        values={highlights}
        onChange={setHighlights}
      />

      <StringListField
        label="What's included"
        addLabel="Add inclusion"
        placeholder="e.g. Two helmets"
        values={included}
        onChange={setIncluded}
      />

      <div className="grid gap-2">
        <Label htmlFor="delivery">Pickup & delivery</Label>
        <textarea
          id="delivery"
          name="delivery"
          rows={2}
          defaultValue={initial?.delivery}
          placeholder="Where the bike is picked up or delivered from."
          className={textareaClass}
          required
        />
      </div>

      <StringListField
        label="Rental terms"
        addLabel="Add term"
        placeholder="e.g. A valid driver's license is required at handover"
        values={rentalTerms}
        onChange={setRentalTerms}
      />

      {error ? (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "edit" ? "Saving…" : "Creating…"}
            </>
          ) : mode === "edit" ? (
            "Save changes"
          ) : (
            "Create rental"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
