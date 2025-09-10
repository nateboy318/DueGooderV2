"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const Steps = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotations, setRotations] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Generate a random rotation between -1.5 and 1.5 degrees for each card
    const getRandomRotation = () => {
      const angle = Math.random() * 1 + 0.5; // 0.5 - 1.5
      return Math.random() > 0.5 ? angle : -angle;
    };
    setRotations(Array(3).fill(0).map(getRandomRotation));
  }, []);

  return (
    <section ref={sectionRef} className="pb-20 pt-12 sm:pb-36 sm:pt-20">
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 transition-all duration-1000 xl:px-0",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
        )}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="tracking-tighter text-black">
            <span className="font-sans text-6xl font-bold sm:text-5xl md:text-7xl">
              Ready in 3 Steps
            </span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-12 sm:gap-12 md:grid-cols-3 lg:mt-16">
          {/* Step 1 */}
          <div
            className="rounded-lg bg-gray-100 p-4 transition-all duration-300"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={
              hoveredIndex === 0
                ? { transform: `scale(1.05) rotate(${rotations[0] || 0}deg)` }
                : { transform: "none" }
            }
          >
            <div className="flex h-full min-h-[340px] flex-col items-center rounded-lg bg-white p-10 text-center sm:px-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-myBlue text-4xl font-bold text-white outline-double outline-8 outline-myBlue">
                1
              </div>
              <h3 className="font-sans text-3xl font-bold text-black">
                Upload Your <br />
                Syllabus
              </h3>
              <p className="mt-4 text-base font-normal text-black">
                Upload your course syllabus and our AI will instantly extract
                all your important assignments and due dates.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div
            className="rounded-lg bg-gray-100 p-4 transition-all duration-300"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={
              hoveredIndex === 1
                ? { transform: `scale(1.05) rotate(${rotations[1] || 0}deg)` }
                : { transform: "none" }
            }
          >
            <div className="flex h-full min-h-[340px] flex-col items-center rounded-lg bg-white p-10 text-center sm:px-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-myOrange text-4xl font-bold text-white outline-double outline-8 outline-myOrange">
                2
              </div>
              <h3 className="font-sans text-3xl font-bold text-black">
                Review & Edit Assignments
              </h3>
              <p className="mt-4 text-base font-normal text-black">
                Quickly review, edit, or delete any assignments. Make sure
                everything looks perfect before adding to your calendar.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div
            className="rounded-lg bg-gray-100 p-4 transition-all duration-300"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={
              hoveredIndex === 2
                ? { transform: `scale(1.05) rotate(${rotations[2] || 0}deg)` }
                : { transform: "none" }
            }
          >
            <div className="flex h-full min-h-[340px] flex-col items-center rounded-lg bg-white p-10 text-center sm:px-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-myRed text-4xl font-bold text-white outline-double outline-8 outline-myRed">
                3
              </div>
              <h3 className="font-sans text-3xl font-bold text-black">
                Track Your <br />
                Deadlines
              </h3>
              <p className="mt-4 text-base font-normal text-black">
                Instantly add all your assignments to your Google Calendar and
                stay organized all semester long with daily to-do lists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;