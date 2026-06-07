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

const CATEGORY = "day-tours";

export interface DayTourFormInitial {
  id: string;
  title: string;
  location: string;
  price: number;
  price_unit: string;
  max_per_day: number;
  duration: string;
  description: string;
  pickup: string;
  highlights: string[];
  stops: string[];
  included: string[];
  good_to_know: string[];
  /** Existing photos as { storage path, public url } pairs. */
  photos: { path: string; url: string }[];
}

const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
const orOne = (arr: string[]) => (arr.length ? arr : [""]);

// Create/edit form for Day Tour listings. Priced per group; the type-specific
// fields are the ordered stops on the route and the pickup logistics.
export function DayTourForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: DayTourFormInitial;
}) {
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>(
    initial?.photos.map((p) => p.path) ?? [],
  );
  const [highlights, setHighlights] = useState<string[]>(
    orOne(initial?.highlights ?? []),
  );
  const [stops, setStops] = useState<string[]>(orOne(initial?.stops ?? []));
  const [included, setIncluded] = useState<string[]>(
    orOne(initial?.included ?? []),
  );
  const [goodToKnow, setGoodToKnow] = useState<string[]>(
    orOne(initial?.good_to_know ?? []),
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
      price_unit: String(fd.get("price_unit") ?? "").trim() || "group",
      max_per_day: Number(fd.get("max_per_day")),
      description: String(fd.get("description") ?? "").trim(),
      duration: String(fd.get("duration") ?? "").trim(),
      highlights: clean(highlights),
      stops: clean(stops),
      included: clean(included),
      pickup: String(fd.get("pickup") ?? "").trim(),
      good_to_know: clean(goodToKnow),
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
          placeholder="e.g. Trappist Monastery & Mango Farm"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={initial?.location}
          placeholder="e.g. Jordan"
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
          <Label htmlFor="price">Price (₱)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            defaultValue={initial?.price}
            placeholder="1200"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price_unit">Price unit</Label>
          <Input
            id="price_unit"
            name="price_unit"
            defaultValue={initial?.price_unit ?? "group"}
            placeholder="group"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="max_per_day">Max bookings / day</Label>
          <Input
            id="max_per_day"
            name="max_per_day"
            type="number"
            min={1}
            defaultValue={initial?.max_per_day}
            placeholder="4"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            defaultValue={initial?.duration}
            placeholder="e.g. Half day"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description}
          placeholder="What the tour is and what makes it special."
          className={textareaClass}
          required
        />
      </div>

      <StringListField
        label="Highlights"
        addLabel="Add highlight"
        placeholder="e.g. Visit to the Trappist Monastery"
        values={highlights}
        onChange={setHighlights}
      />

      <StringListField
        label="Stops on the route"
        addLabel="Add stop"
        placeholder="e.g. Working mango plantation"
        values={stops}
        onChange={setStops}
      />

      <StringListField
        label="What's included"
        addLabel="Add inclusion"
        placeholder="e.g. Air-conditioned vehicle and driver-guide"
        values={included}
        onChange={setIncluded}
      />

      <div className="grid gap-2">
        <Label htmlFor="pickup">Pickup</Label>
        <textarea
          id="pickup"
          name="pickup"
          rows={2}
          defaultValue={initial?.pickup}
          placeholder="Pickup logistics for the day."
          className={textareaClass}
          required
        />
      </div>

      <StringListField
        label="Good to know"
        addLabel="Add note"
        placeholder="e.g. Dress modestly for the monastery"
        values={goodToKnow}
        onChange={setGoodToKnow}
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
            "Create tour"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
