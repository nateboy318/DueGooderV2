import { appConfig } from "@/lib/config";
import { Metadata } from "next";
import React from "react";
import { Header } from "@/components/layout/header";
import FooterSection from "@/components/sections/footer-1";

export const metadata: Metadata = {
  title: {
    template: "%s | " + appConfig.projectName,
    default: appConfig.projectName,
  },
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
};

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}

export default WebsiteLayout;
