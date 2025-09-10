import React from "react";

const TrustedBy = () => {
  return (
    <section className="relative overflow-hidden border-black pt-0 sm:pt-12 lg:pt-16 xl:pt-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-x-16 text-center lg:flex-col lg:text-left">
          <div className="max-w-5xl px-6 sm:px-0">
            <h2 className="hidden text-center font-bold text-black sm:mb-12 sm:block sm:text-3xl lg:text-7xl">
              Used by students from 50+ Universities
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-8 sm:mt-16 sm:gap-y-12 md:gap-12 lg:mt-0">
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university1.png"
              alt=""
            />
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university2.png"
              alt=""
            />
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university3.png"
              alt=""
            />
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university4.png"
              alt=""
            />
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university5.png"
              alt=""
            />
            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university6.png"
              alt=""
            />

            <img
              className="trasnition-all w-40 max-w-full object-contain grayscale duration-300 hover:grayscale-0 sm:h-12 sm:w-56 md:h-16"
              src="/_static/logos/university9.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;