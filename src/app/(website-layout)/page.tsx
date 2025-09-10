"use client";

import React, { useEffect } from "react";
import BouncyCardsFeatures from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import Googleintegration from "@/components/sections/googleintegration";
import StatsSection from "@/components/sections/stats";
import TrustedBy from "@/components/sections/trustedby";
import Steps from "@/components/sections/steps";
import FAQSection from "@/components/sections/faq";
import Cta from "@/components/sections/signupCTA";
import Testimonials from "@/components/sections/testimonials";
import VideoSection from "@/components/sections/video-hero";
import TextsFeature from "@/components/sections/texts-feature";
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const WebsiteHomepage = () => {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/673e19664304e3196ae5c3a8/1id596e73";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    document.head.appendChild(s1);

    // Cleanup function
    return () => {
      document.head.removeChild(s1);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Traffic Banner */}
      {/* <TrafficBanner /> */}

      {/* Grid background */}
      <div
        className="fixed inset-0 -z-10 size-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
          backgroundSize: "6rem 4rem",
          backgroundColor: "white",
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Font Test */}
    
        <div id="hero">
          <HeroLanding />
        </div>

        <div id="stats">
          <StatsSection />
        </div>

        <div id="feature-cta">
          <TextsFeature />
        </div>

        <div id="google-integration">
          <Googleintegration />
        </div>

        <div id="how-it-works">
          <Steps />
        </div>

        <div id="video">
          <VideoSection />
        </div>

        <div id="features">
          <BouncyCardsFeatures />
        </div>

        <div id="sign-up">
          <Cta />
        </div>

        <div id="trusted-by">
          <TrustedBy />
        </div>

        <div id="testimonials">
          <Testimonials />
        </div>

        <div className="z-40" id="faq">
          <FAQSection />
        </div>
      </div>
    </div>
  );
};

export default WebsiteHomepage;