import { getPolicyBySlug } from "@/lib/mdx/policies";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { appConfig } from "@/lib/config";
import { WebPageJsonLd } from "next-seo";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyBySlug("refund");
  if (!policy) return {};

  const ogImage = `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`;

  return {
    title: policy.frontmatter.title,
    description: policy.frontmatter.description,
    openGraph: {
      title: policy.frontmatter.title,
      description: policy.frontmatter.description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/refund`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: policy.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: policy.frontmatter.title,
      description: policy.frontmatter.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/refund`,
    },
  };
}

export default async function RefundPolicyPage() {
  const policy = await getPolicyBySlug("refund");
  
  if (!policy) {
    notFound();
  }

  return (
    <>
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/refund`}
        title={policy.frontmatter.title}
        description={policy.frontmatter.description}
        lastUpdated={policy.frontmatter.lastUpdated}
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
        about={{
          "@type": "Thing",
          name: "Refund Policy",
        }}
      />
      <header className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">{policy.frontmatter.title}</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(policy.frontmatter.lastUpdated), "MMMM d, yyyy")}
        </p>
      </header>

      <main className="policy-content">
        {policy.content}
      </main>
    </>
  );
}
