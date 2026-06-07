import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AccountForm } from "./account-form";

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30 pt-24 pb-16">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mt-6">
            <Suspense fallback={<AccountFormFallback />}>
              <AccountFormLoader />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function AccountFormLoader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      fbLink: true,
    },
  });

  const initial = {
    email: dbUser?.email ?? user.email ?? "",
    firstName: dbUser?.firstName ?? "",
    lastName: dbUser?.lastName ?? "",
    phone: dbUser?.phone ?? "",
    fbLink: dbUser?.fbLink ?? "",
  };

  return <AccountForm initial={initial} />;
}

function AccountFormFallback() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
        <div className="flex justify-end">
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
