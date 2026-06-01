"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { reservationFees } from "@/lib/admin/data";

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function AdminSettingsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="max-w-2xl space-y-6"
    >
      <AdminPageHeader
        title="Settings"
        description="Business details, the reservation fee, and integrations."
      />

      <SettingsCard title="Business" description="Shown to customers across the site.">
        <div className="grid gap-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" defaultValue="GuimarasGo" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              defaultValue="hello@guimarasgo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" defaultValue="+63 917 000 0000" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="facebook">Facebook page</Label>
          <Input id="facebook" defaultValue="fb.com/guimarasgo" />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Reservation fees"
        description="The non-refundable fee charged online to hold a slot, set per tour type. The service balance is paid in person on arrival."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {reservationFees.map((f) => (
            <div key={f.slug} className="grid gap-2">
              <Label htmlFor={`fee-${f.slug}`}>{f.label} (₱)</Label>
              <Input
                id={`fee-${f.slug}`}
                type="number"
                min={0}
                defaultValue={f.fee}
              />
            </div>
          ))}
        </div>
      </SettingsCard>

      {submitted ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Preview only — connect a backend to actually save settings.
        </div>
      ) : null}

      <div>
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
