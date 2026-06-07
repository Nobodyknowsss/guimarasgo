import {
  Search,
  CreditCard,
  Smile,
  MapPin,
  CalendarCheck,
  Sailboat,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Bell,
  Mail,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type StepVisual = "browse" | "reserve" | "arrive";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  visual: StepVisual;
};

const steps: Step[] = [
  {
    icon: Search,
    title: "Browse & pick your adventure",
    description:
      "Compare island-hopping trips, day tours, and motorcycle rentals — dates, inclusions, and prices all upfront.",
    detail:
      "No inflated marketing, no hidden fees. Just pick the experience that fits your trip.",
    visual: "browse",
  },
  {
    icon: CreditCard,
    title: "Reserve with a small fee",
    description:
      "Lock your slot with a flat ₱100 reservation fee via GCash, Maya, or QR Ph. Your spot is held the moment you pay.",
    detail:
      "If the slot isn't available, you're never charged. No subscriptions, no surprises.",
    visual: "reserve",
  },
  {
    icon: Smile,
    title: "Pay the rest on arrival",
    description:
      "Settle the remaining balance with us in person on the day — cash or e-wallet, whatever's easiest for you.",
    detail:
      "We'll send a confirmation right away, and our local crew will be ready when you arrive.",
    visual: "arrive",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Booking your adventure takes 3 steps
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No apps, no fine print. Just a clean handshake between you and
            GuimarasGo — explore, reserve, and go.
          </p>
        </div>

        <ol className="mt-16 space-y-16 sm:mt-20 lg:space-y-24">
          {steps.map((step, i) => {
            const reverse = i % 2 === 1;
            return (
              <li
                key={step.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Text */}
                <div className={reverse ? "lg:order-2" : undefined}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
                    <step.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Step {i + 1}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-pretty text-muted-foreground">
                    {step.description}
                  </p>
                  <p className="mt-3 max-w-md text-pretty text-muted-foreground">
                    {step.detail}
                  </p>
                </div>

                {/* Visual */}
                <div className={reverse ? "lg:order-1" : undefined}>
                  <StepArt visual={step.visual} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Decorative step mockups (pure CSS, no images) ---------- */

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[2.25rem] bg-gradient-to-br from-sky-100 via-sky-50 to-white"
      />
      <div className="relative px-6 py-10 sm:px-10">{children}</div>
    </div>
  );
}

function FloatChip({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg shadow-sky-900/10 ${className}`}
    >
      <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
      <span className="whitespace-nowrap text-xs font-medium text-foreground">
        {label}
      </span>
    </div>
  );
}

function StepArt({ visual }: { visual: StepVisual }) {
  if (visual === "browse") {
    return (
      <VisualFrame>
        <div className="relative rounded-3xl border border-border bg-card p-2.5 shadow-xl shadow-sky-900/10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600">
            <Sailboat
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/70"
              strokeWidth={1.5}
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              Island Hopping
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ave Maria &amp; Natago
              </p>
              <p className="text-xs text-muted-foreground">
                Full day · local crew
              </p>
            </div>
            <span className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
              ₱350
            </span>
          </div>
        </div>

        <FloatChip
          icon={MapPin}
          label="3 islands"
          className="-left-3 top-1/3 sm:-left-5"
        />
        <FloatChip
          icon={CalendarCheck}
          label="Available today"
          className="-right-3 bottom-6 sm:-right-5"
        />
      </VisualFrame>
    );
  }

  if (visual === "reserve") {
    return (
      <VisualFrame>
        <div className="relative rounded-3xl border border-border bg-card p-5 shadow-xl shadow-sky-900/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Reservation fee
            </span>
            <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} />
          </div>
          <p className="mt-1 text-3xl font-bold text-foreground">
            ₱100
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              non-refundable
            </span>
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["GCash", "Maya", "QR Ph"].map((m) => (
              <span
                key={m}
                className="rounded-lg border border-border bg-muted py-2 text-center text-xs font-medium text-foreground"
              >
                {m}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
            Pay ₱100
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </div>

        <FloatChip
          icon={Clock}
          label="Slot held · 14:59"
          className="-right-3 top-6 sm:-right-5"
        />
        <FloatChip
          icon={ShieldCheck}
          label="Secure payment"
          className="-left-3 bottom-8 sm:-left-5"
        />
      </VisualFrame>
    );
  }

  return (
    <VisualFrame>
      <div className="relative rounded-3xl border border-border bg-card p-5 shadow-xl shadow-sky-900/10">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Booking confirmed
            </p>
            <p className="text-xs text-muted-foreground">Ref #GG-2041</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-3.5 py-2.5">
          <span className="text-xs text-muted-foreground">
            Balance on arrival
          </span>
          <span className="text-sm font-semibold text-foreground">₱250</span>
        </div>
      </div>

      <FloatChip
        icon={Bell}
        label="Owner notified"
        className="-left-3 top-5 sm:-left-5"
      />
      <FloatChip
        icon={Mail}
        label="Confirmation sent"
        className="-right-3 bottom-6 sm:-right-5"
      />
    </VisualFrame>
  );
}
