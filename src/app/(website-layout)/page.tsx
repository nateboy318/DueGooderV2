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
import { appConfig } from "@/lib/config";
import { WebPageJsonLd } from "next-seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: appConfig.projectName,
  description: appConfig.description,
  openGraph: {
    title: appConfig.projectName,
    description: appConfig.description,
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: appConfig.projectName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.projectName,
    description: appConfig.description,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function WebsiteHomepage() {
  return (
    <main>
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}`}
        title={appConfig.projectName}
        description={appConfig.description}
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <WebsiteHero />
      <CompanyLogos />
      <WebsiteFeatures />
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
