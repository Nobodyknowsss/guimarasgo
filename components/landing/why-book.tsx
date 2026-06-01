import { ShieldCheck, BadgeCheck, Lock, LifeBuoy } from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Run by locals",
    description:
      "Every tour and rental is operated directly by GuimarasGo. No middlemen, no surprises — just locals showing you our island.",
  },
  {
    icon: ShieldCheck,
    title: "No double-booking, ever",
    description:
      "Your slot is held the moment you start payment. If a tour is full, you're never charged — no refunds needed.",
  },
  {
    icon: Lock,
    title: "Secure local payment",
    description:
      "Reservation fee via PayMongo (GCash, Maya, QR Ph). The rest you pay us on arrival.",
  },
  {
    icon: LifeBuoy,
    title: "Local support, fast",
    description:
      "Need help? Message us on Telegram or Viber. We're in Guimaras, on Philippine time, and we actually reply.",
  },
];

export function WhyBook() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why GuimarasGo
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The way we&apos;d want to book our own trip
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              We built GuimarasGo because booking a Guimaras tour usually means
              a dozen unanswered Facebook messages. This is the alternative.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
