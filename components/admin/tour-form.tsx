"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { tourCategoryOptions } from "@/lib/admin/data";

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export interface TourFormInitial {
  category?: string;
  title?: string;
  price?: number;
  priceUnit?: string;
  maxPerDay?: number;
  badge?: string | null;
  rating?: number;
  reviews?: number;
  shortDescription?: string;
  active?: boolean;
}

export function TourForm({
  mode,
  initial = {},
}: {
  mode: "create" | "edit";
  initial?: TourFormInitial;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          defaultValue={initial.category ?? tourCategoryOptions[0].slug}
          className={fieldClass}
        >
          {tourCategoryOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initial.title}
          placeholder="e.g. Classic 7-Island Hopping"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Photos (up to 6)</Label>
        <ImageUploader max={6} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (₱)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={initial.price}
            placeholder="450"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priceUnit">Price unit</Label>
          <select
            id="priceUnit"
            name="priceUnit"
            defaultValue={initial.priceUnit ?? "person"}
            className={fieldClass}
          >
            <option value="person">per person</option>
            <option value="group">per group</option>
            <option value="day">per day</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2 sm:max-w-[14rem]">
        <Label htmlFor="maxPerDay">Max bookings / day</Label>
        <Input
          id="maxPerDay"
          name="maxPerDay"
          type="number"
          min={1}
          defaultValue={initial.maxPerDay}
          placeholder="6"
        />
        <p className="text-xs text-muted-foreground">
          How many bookings this offering can take in a single day.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="badge">Badge</Label>
          <select
            id="badge"
            name="badge"
            defaultValue={initial.badge ?? ""}
            className={fieldClass}
          >
            <option value="">None</option>
            <option value="Popular">Popular</option>
            <option value="New">New</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="active">Status</Label>
          <select
            id="active"
            name="active"
            defaultValue={initial.active === false ? "draft" : "active"}
            className={fieldClass}
          >
            <option value="active">Active (visible on site)</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={3}
          defaultValue={initial.shortDescription}
          placeholder="One or two lines shown on the listing card."
          className={`${fieldClass} h-auto`}
        />
      </div>

      <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        Full detail fields (highlights, what&apos;s included, itinerary / specs,
        terms) will be edited here once the backend is connected.
      </p>

      {submitted ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Preview only — connect a backend to actually{" "}
          {mode === "create" ? "create" : "save"} this listing.
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit">
          {mode === "create" ? "Create tour" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
