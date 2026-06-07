"use client";

import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

// Repeatable text-list input shared by the tour forms — each maps to a Postgres
// text[] column (highlights / islands / stops / included / specs / etc).
export function StringListField({
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

/** Shared textarea styling used across the tour forms. */
export const textareaClass =
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
