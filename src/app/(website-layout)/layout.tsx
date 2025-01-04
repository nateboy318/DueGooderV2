import { appConfig } from "@/lib/config";
import { Metadata } from "next";
import React from "react";
import { Header } from "@/components/layout/header";
import FooterSection from "@/components/sections/footer-1";

export const metadata: Metadata = {
  title: {
    template: "%s | %s",
    default: appConfig.projectName,
  },
  description: appConfig.description,
};

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}

export default WebsiteLayout;
