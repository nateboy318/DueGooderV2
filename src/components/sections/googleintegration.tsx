import React from "react";
import { Check } from "lucide-react";

const TextsFeature = () => {
  return (
    <section className="bg-white py-12 sm:py-12 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: Title */}

          {/* Text: always left-aligned */}
          <div className="rounded-lg bg-gray-100 p-12 text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
              Integrated With Google Calendar
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Automatically syncs all your assignments to your Google Calendar
            </p>
            <ul className="mt-8 space-y-5">
              <li className="flex items-center text-gray-900 lg:justify-start">
                <Check className="size-6 shrink-0 text-myBlue" />
                <span className="font-pj ml-3 text-lg font-medium">
                  Live Google Calendar monitoring
                </span>
              </li>
              <li className="flex items-center text-gray-900 lg:justify-start">
                <Check className="size-6 shrink-0 text-myBlue" />
                <span className="font-pj ml-3 text-lg font-medium">
                  Instant sync with your existing Google Calendar
                </span>
              </li>
              <li className="flex items-center text-gray-900 lg:justify-start">
                <Check className="size-6 shrink-0 text-myBlue" />
                <span className="font-pj ml-3 text-lg font-medium">
                  Color-coded events by course
                </span>
              </li>
              <li className="flex items-center text-gray-900 lg:justify-start">
                <Check className="size-6 shrink-0 text-myBlue" />
                <span className="font-pj ml-3 text-lg font-medium">
                  Smart reminders for assignments
                </span>
              </li>
            </ul>
            <button
              onClick={() => (window.location.href = "/register")}
              className="font-pj mt-16 inline-flex w-full items-center justify-center rounded-xl border-2 border-transparent bg-black px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base lg:px-8 lg:py-3 lg:text-lg"
            >
              Connect Google Calendar
            </button>
          </div>

          {/* Right: Image (hidden on mobile) */}
          <div className="hidden justify-center lg:flex lg:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <img
                src="/_static/img/IphoneCalendar.png"
                alt="iPhone showing daily to-do lists"
                className="max-h-[850px] w-full rotate-6 object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextsFeature;