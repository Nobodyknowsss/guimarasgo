import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sailboat, Sun, Bike } from "lucide-react";

const services = [
  {
    icon: Sailboat,
    title: "Island Hopping",
    description:
      "Hop between Guimaras' best-kept islands — Adlobijod, Natago, and Turtle Island — guided by GuimarasGo's local crew who know every cove.",
    tag: "From ₱350 per person",
    image: "/category/island-hopping.webp",
    imageAlt: "Wooden bangka boat anchored on turquoise tropical water",
    href: "/tours/island-hopping",
  },
  {
    icon: Sun,
    title: "Day Tours",
    description:
      "Land tours with a driver/guide — Trappist Monastery, Guisi Lighthouse, mango plantations, and the island's hidden viewpoints.",
    tag: "From ₱1,200 per group",
    image: "/category/day-tours.webp",
    imageAlt: "Coastal lighthouse on a cliff overlooking the sea",
    href: "/tours/day-tours",
  },
  {
    icon: Bike,
    title: "Motorcycle Rentals",
    description:
      "Explore Guimaras at your own pace. Well-maintained scooters and adventure bikes, delivered to your accommodation.",
    tag: "From ₱400 per day",
    image: "/category/motorcycle-rentals.webp",
    imageAlt: "Vintage Vespa scooter parked by a tropical roadside",
    href: "/tours/motorcycle-rentals",
  },
];

export function ServiceCategories() {
  return (
    <section id="tours" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            What we offer
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three ways to experience the island
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Whether you want the sea, the road, or both — pick a category and
            book directly with our local crew.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description, tag, image, imageAlt, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent" />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    Browse
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
