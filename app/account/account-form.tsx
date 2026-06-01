"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";

type Props = {
  initial: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    fbLink: string;
  };
};

export function AccountForm({ initial }: Props) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [fbLink, setFbLink] = useState(initial.fbLink);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "ok"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.ok) {
        setStatus({ type: "ok", message: "Profile saved." });
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Your account</CardTitle>
        <CardDescription>
          Update your details. Your email is locked — it&apos;s how you sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={initial.email}
              readOnly
              disabled
              className="cursor-not-allowed bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Email is locked. Contact support if you need to change it.
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

          {status.type === "ok" ? (
            <p className="text-sm text-emerald-600">{status.message}</p>
          ) : null}
          {status.type === "error" ? (
            <p className="text-sm text-red-500">{status.message}</p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
