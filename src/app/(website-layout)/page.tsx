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
import { WebPageJsonLd, OrganizationJsonLd, BrandJsonLd, FAQPageJsonLd } from "next-seo";
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
        id={process.env.NEXT_PUBLIC_APP_URL}
        title={appConfig.projectName}
        description={appConfig.description}
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <OrganizationJsonLd
        useAppDir
        type="Organization"
        id={process.env.NEXT_PUBLIC_APP_URL}
        logo={`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`}
        legalName={appConfig.projectName}
        name={appConfig.projectName}
        address={{
          streetAddress: appConfig.legal.address.street,
          addressLocality: appConfig.legal.address.city,
          addressRegion: appConfig.legal.address.state,
          postalCode: appConfig.legal.address.postalCode,
          addressCountry: appConfig.legal.address.country,
        }}
        contactPoint={{
          telephone: appConfig.legal.phone,
          contactType: "customer service",
          email: appConfig.legal.email,
          areaServed: "Worldwide",
          availableLanguage: ["English"],
        }}
        url={process.env.NEXT_PUBLIC_APP_URL}
      />
      <BrandJsonLd
        useAppDir
        id={process.env.NEXT_PUBLIC_APP_URL}
        slogan={appConfig.description}
        logo={`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`}
      />
      <FAQPageJsonLd
        useAppDir
        mainEntity={[
          {
            questionName: "What is Indiekit?",
            acceptedAnswerText: "Indiekit is a modern publishing platform that helps you create and manage your content independently.",
          },
          {
            questionName: "How does it work?",
            acceptedAnswerText: "Indiekit provides a simple yet powerful interface to manage your content, with features like markdown support, media management, and more.",
          },
          {
            questionName: "Is it open source?",
            acceptedAnswerText: "Yes, Indiekit is open source and can be self-hosted or used through our managed service.",
          },
        ]}
      />
      <article>
        <header>
          <WebsiteHero />
          <CompanyLogos />
        </header>
        <section aria-label="Features">
          <WebsiteFeatures />
        </section>
        <section aria-label="Problem Statement">
          <ProblemStatement />
        </section>
        <section aria-label="Comparison">
          <WithWithout />
        </section>
        <section aria-label="How It Works">
          <HowItWorks />
        </section>
        <section aria-label="Testimonials">
          <WebsiteTestimonials />
        </section>
        <aside aria-label="Call to Action">
          <CTA4 />
        </aside>
        <section aria-label="Pricing">
          <WebsitePricing />
        </section>
        <section aria-label="FAQs">
          <WebsiteFAQs />
        </section>
        <aside aria-label="Final Call to Action">
          <CTA2 />
        </aside>
      </article>
    </main>
  );
}
