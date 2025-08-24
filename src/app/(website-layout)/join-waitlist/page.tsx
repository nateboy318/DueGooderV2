import { Metadata } from "next";
import WaitlistForm from "./waitlist-form";
import { WebPageJsonLd } from "next-seo";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden relative">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[150%] skew-y-12"
        )}
      />
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
      <div className="container max-w-md px-4 py-16 z-50">
        <div className="bg-background">
          <div className="rounded-3xl bg-muted/40 p-8 shadow-xs ring-1 ring-border/60">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">Join Our Waitlist</h1>
              <p className="text-muted-foreground">
                Be among the first to experience our platform when we launch.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  );
}
