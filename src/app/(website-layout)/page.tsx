import { WebsiteFAQs } from "@/components/website/faqs";
import { CTA2 } from "@/components/website/cta-2";
import { WithWithout } from "@/components/website/with-without";
import Hero2 from "@/components/sections/hero-2";
import CTA1 from "@/components/website/cta-1";
import MonthlyAnnualPricing from "@/components/website/monthly-annual-pricing";
import TextRevealByWord from "@/components/ui/text-reveal";

export default function WebsiteHomepage() {
  return (
    <>
      <Hero2 />
      <CTA1 />
      <MonthlyAnnualPricing />
      <TextRevealByWord text="Still not sure? My users are able to create their own blogs and websites with ease. It was very difficult to find a solution that was easy to use and affordable." />
      <WithWithout />
      <MonthlyAnnualPricing />
      <WebsiteFAQs />
      <CTA2 />
    </>
  );
}
