"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";

const textareaClass =
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

// Repeatable text-list input used for highlights / islands / included — each maps
// to a Postgres text[] column on island_hopping_listings.
function StringListField({
  label,
  addLabel,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  addLabel: string;
  placeholder?: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  function update(i: number, v: string) {
    onChange(values.map((val, idx) => (idx === i ? v : val)));
  }
  function add() {
    onChange([...values, ""]);
  }
  function remove(i: number) {
    const next = values.filter((_, idx) => idx !== i);
    onChange(next.length ? next : [""]);
  }

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((value, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${label.toLowerCase()} item`}
              className={cn(
                "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground ring-1 ring-border transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400",
                focusRing,
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className={cn(
          "inline-flex w-fit cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/10",
          focusRing,
        )}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

// Add-listing form for Island Hopping. Fields mirror the island_hopping_listings
// schema exactly (category is fixed to "island-hopping"). Frontend only for now:
// photos really upload via /api/island-hopping/photos, but submitting the form
// doesn't persist the listing yet.
export function IslandHoppingForm() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [islands, setIslands] = useState<string[]>([""]);
  const [included, setIncluded] = useState<string[]>([""]);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Frontend only — this is the payload shape the create API expects.
    setSubmitted(true);
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
          placeholder="e.g. Classic 7-Island Hopping"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g. Nueva Valencia"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Photos (up to 6)</Label>
        <ImageUploader max={6} onChange={setPhotos} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (₱)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            placeholder="450"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price_unit">Price unit</Label>
          <Input
            id="price_unit"
            name="price_unit"
            defaultValue="person"
            placeholder="person"
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
          placeholder="6"
          required
        />
        <p className="text-xs text-muted-foreground">
          How many bookings this trip can take in a single day.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="What the trip is and what makes it special."
          className={textareaClass}
          required
        />
      </div>

      <StringListField
        label="Highlights"
        addLabel="Add highlight"
        placeholder="e.g. Seven island and sandbar stops"
        values={highlights}
        onChange={setHighlights}
      />

      <StringListField
        label="Islands / stops"
        addLabel="Add island"
        placeholder="e.g. Ave Maria Island"
        values={islands}
        onChange={setIslands}
      />

      <StringListField
        label="What's included"
        addLabel="Add inclusion"
        placeholder="e.g. Private bangka and licensed boatman"
        values={included}
        onChange={setIncluded}
      />

      <div className="grid gap-2">
        <Label htmlFor="meeting_point">Meeting point</Label>
        <textarea
          id="meeting_point"
          name="meeting_point"
          rows={2}
          placeholder="Where guests meet the boatman, and when."
          className={textareaClass}
          required
        />
      </div>

      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Preview only — {photos.length} photo
            {photos.length === 1 ? "" : "s"} uploaded. Wiring this form to{" "}
            <code className="font-mono text-xs">POST /api/island-hopping</code>{" "}
            comes next.
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit">Create tour</Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
