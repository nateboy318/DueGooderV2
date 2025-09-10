"use client";

import { useEffect, useState } from "react";

interface Image {
  src: string;
  alt: string;
}

export default function HeroLanding() {
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile !== null) {
      setShowContent(true);
    }
  }, [isMobile]);

  const imageSrc = isMobile
    ? "/_static/img/mobileclasses.png"
    : "/_static/img/myclasses.png";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div
            className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
          >
            <p className="font-inter pt-4 text-xs text-gray-500 sm:pt-6 sm:text-base">
              🔓 All Access 7-Day Free Trial · No credit card required
            </p>
            <h1 className="font-inter px-2 text-base text-gray-600 sm:px-6 sm:text-lg">
              {" "}
            </h1>
            <p className="font-pj mt-2 text-[3rem] font-extrabold leading-tight text-gray-900 sm:mt-3 sm:text-5xl sm:leading-tight md:text-5xl lg:text-7xl lg:leading-tight">
              {isMobile ? (
                <>
                  We track your
                  <br />
                  <span className="rounded-xl border-l-[12px] border-l-myBlue bg-myBlue/20 px-[12px]">
                    Due Dates
                  </span>
                </>
              ) : (
                <>
                  We Track Your Due Dates&nbsp;
                  <br className="hidden sm:block" />
                  <span className="rounded-xl border-l-3 border-l-myBlue bg-myBlue/20 px-[6px] sm:border-l-[12px] sm:px-[8px]">
                    So You Don&apos;t Have To
                  </span>
                </>
              )}
            </p>
            <div className="flex flex-row items-center justify-center gap-4 space-y-4 px-4 pt-6 sm:mt-6 sm:gap-0 sm:space-x-5 sm:space-y-0 sm:px-8 sm:pt-0 md:mt-9">
              <a
                href="/register"
                className="font-pj mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 border-transparent bg-black px-4 py-2 text-base font-bold text-white transition-all duration-200 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base lg:px-8 lg:py-3 lg:text-lg"
                role="button"
                data-umami-event="CTA-Clicked"
                data-umami-event-cta="Hero Free Button"
              >
                Get Started
              </a>
              <a
                href="#how-it-works"
                className="font-pj inline-flex w-full items-center justify-center rounded-xl border-2 border-black px-4 py-2 text-base font-bold text-black transition-all duration-200 hover:border-black hover:bg-black hover:text-white focus:border-black focus:bg-black focus:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base lg:px-8 lg:py-3 lg:text-lg"
                role="button"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="4 p-8 pb-4 sm:py-8 md:pt-12 lg:pt-16">
        <div className="relative">
          <div className="relative mx-auto">
            <div
              className={`mt-6 transition-opacity duration-1000 sm:mt-16 lg:mx-auto lg:max-w-7xl ${showContent ? "opacity-100" : "opacity-0"}`}
            >
              <div className="relative h-full w-full rounded-md border-l-8 border-r-8 border-t-8 border-l-myOrange border-r-myRed border-t-myBlue bg-gray-100 p-4">
                <img
                  src={imageSrc}
                  alt="My Classes"
                  className="h-full w-full rounded-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}