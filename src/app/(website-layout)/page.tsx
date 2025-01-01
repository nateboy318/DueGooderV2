"use client";

import { WebsiteHero } from "@/components/website/hero";
import { WebsiteFeatures } from "@/components/website/features";
import { HowItWorks } from "@/components/website/how-it-works";
import { WebsiteTestimonials } from "@/components/website/testimonials";
import { WebsitePricing } from "@/components/website/pricing";
import { WebsiteFAQs } from "@/components/website/faqs";
import { CTA2 } from "@/components/website/cta-2";
import { CTA4 } from "@/components/website/cta-4";

export default function WebsiteHomepage() {
  return (
    <main>
      <WebsiteHero />
      <WebsiteFeatures />
      <HowItWorks />
      <WebsiteTestimonials />
      <CTA4 />
      <WebsitePricing />
      <WebsiteFAQs />
      <CTA2 />
    </main>
  );
}
