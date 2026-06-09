import Link from "next/link";
import { Mail, Facebook, MessageCircle, ArrowUpRight } from "lucide-react";

// NOTE: the Facebook page is a placeholder; swap in GuimarasGo's real page.
const channels = [
  {
    icon: Mail,
    label: "Email us",
    value: "guimarasgo@gmail.com",
    hint: "On Philippine time (GMT+8), 8am to 8pm daily",
    href: "mailto:guimarasgo@gmail.com",
  },
  {
    icon: Facebook,
    label: "Message us on Facebook",
    value: "fb.com/guimarasgo",
    hint: "Usually replies within the hour",
    href: "https://facebook.com/guimarasgo",
  },
];

export function Contact() {
  return (
    <section id="about" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          {/* Intro */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
              Contact us
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions? Talk to a local.
            </h2>
            <p className="mt-4 max-w-md text-pretty text-muted-foreground">
              We&apos;re a small, local team in Guimaras. Message or email us
              anytime, and a real person will get back to you and help you plan the
              perfect trip.
            </p>
            <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground">
              On Philippine time (GMT+8), and we actually reply.
            </p>
          </div>

          {/* Contact channels */}
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, hint, href }) => {
              const external = href.startsWith("http");
              return (
                <Link
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {value}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {hint}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
