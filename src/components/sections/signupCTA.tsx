import React from "react";

const Cta = () => {
  return (
    <section className="relative mb-16 overflow-hidden bg-myBlue py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-center text-center sm:max-w-md md:flex-row md:items-start md:text-left lg:max-w-2xl">
            <p className="shrink-0 text-3xl sm:text-4xl lg:text-5xl"></p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:ml-4 md:mt-0 lg:ml-8 lg:text-7xl">
              Join Free & Never <br /> Miss a Due Date
            </h2>
          </div>

          <div className="flex flex-col items-center space-y-2 sm:mt-8 md:mt-0">
            <a
              href="/register"
              title=""
              className="font-pj mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 border-white px-6 py-3 text-lg font-bold text-white transition-all duration-200 hover:border-black hover:bg-white hover:text-black focus:border-white focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 sm:mt-0 sm:w-auto"
              role="button"
              data-umami-event="CTA-Clicked"
              data-umami-event-cta="Free Signup Button"
            >
              Get Started For Free
            </a>

            <p className="text-sm font-normal text-white">
              No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;