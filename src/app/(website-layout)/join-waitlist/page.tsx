import { Metadata } from "next";
import WaitlistForm from "./waitlist-form";
import { WebPageJsonLd } from "next-seo";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Join Waitlist",
  description: "Join our waitlist to get early access to our platform.",
  openGraph: {
    title: "Join Waitlist",
    description: "Join our waitlist to get early access to our platform.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/join-waitlist`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: "Join Waitlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Waitlist",
    description: "Join our waitlist to get early access to our platform.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/join-waitlist`,
  },
};

export default function JoinWaitlistPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/join-waitlist`}
        title="Join Waitlist"
        description="Join our waitlist to get early access to our platform."
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <div className="container max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Join Our Waitlist</h1>
          <p className="text-muted-foreground">
            Be among the first to experience our platform when we launch.
          </p>
        </div>
        <WaitlistForm />
      </div>
    </div>
  );
} 