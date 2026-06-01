import { Search, CreditCard, Smile } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & pick",
    description:
      "Compare tours, dates, and what's included. Read reviews from real guests — no inflated marketing.",
  },
  {
    icon: CreditCard,
    title: "Reserve with a small fee",
    description:
      "Lock in your spot with a flat, secure reservation fee via GCash, Maya, or QR Ph. No subscription, no hidden charges.",
  },
  {
    icon: Smile,
    title: "Pay the rest on arrival",
    description:
      "Settle the balance with us in cash or e-wallet on the day. Easy, transparent, no surprises.",
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
            No accounts, no apps, no fine print. Just a clean handshake between
            you and GuimarasGo.
          </p>
        </div>

        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li key={title} className="relative">
              {/* connector line on md+ */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-16 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-primary/40 to-transparent md:block"
                />
              ) : null}

              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="text-5xl font-bold tabular-nums text-primary/15">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-pretty text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
