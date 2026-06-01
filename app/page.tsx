import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { ServiceCategories } from "@/components/landing/service-categories";
import { DiscoverGuimaras } from "@/components/landing/discover-guimaras";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyBook } from "@/components/landing/why-book";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ServiceCategories />
        <DiscoverGuimaras />
        <HowItWorks />
        <WhyBook />
      </main>
      <SiteFooter />
    </>
  );
}
