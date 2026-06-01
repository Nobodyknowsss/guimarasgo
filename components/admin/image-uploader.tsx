"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

// Frontend-only image picker: previews chosen files via object URLs, up to `max`.
// Nothing is uploaded — wiring to Supabase Storage comes with the backend.
export function ImageUploader({ max = 6 }: { max?: number }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep a ref of current images so unmount cleanup can revoke them all.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url)),
    [],
  );

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = max - images.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function remove(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  const atMax = images.length >= max;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.name}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(img.id)}
              aria-label={`Remove ${img.name}`}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {!atMax ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs font-medium">Add</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {images.length}/{max} photos · JPG or PNG. The first photo is used as the
        cover.
      </p>
    </div>
  );
}
