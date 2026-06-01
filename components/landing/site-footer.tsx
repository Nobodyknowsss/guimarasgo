import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Send } from "lucide-react";

const linkColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Island Hopping", href: "#" },
      { label: "Day Tours", href: "#" },
      { label: "Motorcycle Rentals", href: "#" },
      { label: "Discover Guimaras", href: "#discover" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Refund policy", href: "#" },
    ],
  },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Telegram", icon: Send, href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/guimarasgo-logo.webp"
                alt="GuimarasGo"
                width={323}
                height={226}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-background/75">
              Discover Guimaras with GuimarasGo — island-hopping, day tours, and
              rentals, all locally run. A simple, honest way to book your
              adventure.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-background/20 text-background/80 transition-colors hover:border-background/60 hover:bg-background/10 hover:text-background"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {linkColumns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-background">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-background/70 transition-colors hover:text-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-8 text-xs text-background/60 sm:flex-row sm:items-center">
          <p>© 2026 GuimarasGo. All rights reserved.</p>
          <p>Made in Guimaras, Philippines.</p>
        </div>
      </div>
    </footer>
  );
}
