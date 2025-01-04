"use client";

import { WebsiteHero } from "@/components/website/hero";
import { WebsiteFeatures } from "@/components/website/features";
import { HowItWorks } from "@/components/website/how-it-works";
import { WebsiteTestimonials } from "@/components/website/testimonials";
import { WebsitePricing } from "@/components/website/pricing";
import { WebsiteFAQs } from "@/components/website/faqs";
import { CTA2 } from "@/components/website/cta-2";
import { CTA4 } from "@/components/website/cta-4";
import { CompanyLogos } from "@/components/website/company-logos";
import { WithWithout } from "@/components/website/with-without";
import { ProblemStatement } from "@/components/website/problem-statement";
import Hero2 from "@/components/sections/hero-2";
import Testimonial1 from "@/components/sections/testimonial-1";
import Testimonial2 from "@/components/sections/testimonial-2";
import FeatureGrid from "@/components/sections/feature-grid";

export default function WebsiteHomepage() {
  return (
    <main>
      <Hero2 />
      <CompanyLogos />
      <FeatureGrid />
      <ProblemStatement />
      <WithWithout />
      <HowItWorks />
      <WebsiteTestimonials />
      <CTA4 />
      <WebsitePricing />
      <WebsiteFAQs />
      <CTA2 />
    </main>
  );
}
