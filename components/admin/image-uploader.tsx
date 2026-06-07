"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, Loader2, AlertCircle, Check } from "lucide-react";

// Mirrors the server constraints in lib/supabase/storage.ts. Kept here only for
// instant client-side feedback — the route re-validates and is the source of truth.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024;

type Status = "uploading" | "done" | "error";

interface UploadImage {
  id: string;
  localUrl: string; // objectURL (new pick) or remote URL (edit-mode seed)
  name: string;
  status: Status;
  path?: string; // storage path, set on success — this is what the listing stores
  remoteUrl?: string; // public URL, set on success — confirmed preview
  error?: string;
}

interface ImageUploaderProps {
  /** Photos POST endpoint, e.g. /api/day-tours/photos. */
  endpoint: string;
  max?: number;
  /** Existing photos to seed in edit mode (already-uploaded path + public url). */
  initial?: { path: string; url: string }[];
  /** Fires whenever the set of successfully-uploaded photo paths changes. */
  onChange?: (paths: string[]) => void;
}

function isObjectUrl(url: string): boolean {
  return url.startsWith("blob:");
}

// Uploads each chosen file to `endpoint` as it's picked: shows an instant local
// preview, then a spinner, then a confirmed preview (or an error). The uploaded
// storage paths are reported via onChange. In edit mode it is pre-seeded with the
// listing's existing photos so they are kept on save unless removed.
export function ImageUploader({
  endpoint,
  max = 6,
  initial,
  onChange,
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadImage[]>(() =>
    (initial ?? []).map((p) => ({
      id: p.path,
      localUrl: p.url,
      name: p.path,
      status: "done" as const,
      path: p.path,
      remoteUrl: p.url,
    })),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke every objectURL on unmount (skip remote URLs seeded in edit mode).
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () =>
      imagesRef.current.forEach((img) => {
        if (isObjectUrl(img.localUrl)) URL.revokeObjectURL(img.localUrl);
      }),
    [],
  );

  // Report uploaded paths upward whenever they change (ref keeps onChange stable).
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    const paths = images
      .filter((i) => i.status === "done" && i.path)
      .map((i) => i.path as string);
    onChangeRef.current?.(paths);
  }, [images]);

  function patch(id: string, next: Partial<UploadImage>) {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...next } : img)),
    );
  }

  async function uploadOne(id: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        patch(id, { status: "error", error: data.error ?? "Upload failed." });
        return;
      }
      patch(id, { status: "done", path: data.path, remoteUrl: data.url });
    } catch {
      patch(id, { status: "error", error: "Network error." });
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = max - images.length;

    for (const file of files.slice(0, remaining)) {
      const id = crypto.randomUUID();
      const localUrl = URL.createObjectURL(file);

      // Instant client-side guards so obvious problems don't waste an upload.
      let error: string | undefined;
      if (!ALLOWED_TYPES.includes(file.type)) error = "Use JPG, PNG, or WebP.";
      else if (file.size > MAX_BYTES) error = "Too large (max 4MB).";

      setImages((prev) => [
        ...prev,
        {
          id,
          localUrl,
          name: file.name,
          status: error ? "error" : "uploading",
          error,
        },
      ]);

      if (!error) void uploadOne(id, file);
    }
    e.target.value = "";
  }

  function remove(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img && isObjectUrl(img.localUrl)) URL.revokeObjectURL(img.localUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  const atMax = images.length >= max;
  const uploading = images.some((i) => i.status === "uploading");

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
              src={img.remoteUrl ?? img.localUrl}
              alt={img.name}
              className="h-full w-full object-cover"
            />

            {img.status === "uploading" ? (
              <div className="absolute inset-0 grid place-items-center bg-black/40">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : null}

            {img.status === "error" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 p-1 text-center">
                <AlertCircle className="h-4 w-4 text-red-300" />
                <span className="text-[10px] leading-tight text-red-100">
                  {img.error}
                </span>
              </div>
            ) : null}

            {img.status === "done" ? (
              <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" />
              </span>
            ) : null}

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
        {images.length}/{max} photos · JPG, PNG or WebP, max 4MB. The first photo
        is used as the cover.{uploading ? " · Uploading…" : ""}
      </p>
    </div>
  );
}
