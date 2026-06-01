import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { createClient } from "@/lib/supabase/server";

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-svh bg-muted/30 pt-24 pb-16">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/#tours"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all categories
          </Link>

          <Suspense fallback={<BookCardFallback />}>
            <BookCard />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function BookCard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/book");
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <CalendarCheck className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Reservations launching soon
      </h1>
      <p className="mt-3 text-pretty text-muted-foreground">
        Your account is ready, {user.email}. We&apos;re finishing the ₱100
        reservation flow now — once it&apos;s live, you&apos;ll be able to lock
        in a slot from any tour or rental page. We&apos;ll email you the moment
        it opens.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/#tours"
          className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse tours
        </Link>
        <Link
          href="/account"
          className="inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
        >
          My account
        </Link>
      </div>
    </div>
  );
}

function BookCardFallback() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-5 h-7 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-6 flex gap-3">
        <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
