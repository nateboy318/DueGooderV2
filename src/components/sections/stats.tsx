"use client";

import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";
import CountUp from "react-countup";
import { formatStatNumber } from "@/lib/utils";

interface ApiResponse {
  dueDateAddedCount: number;
  lastUpdated: string;
  error?: string;
}

const useOnScreen = (options = {}): [RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [JSON.stringify(options)]);

  return [ref as RefObject<HTMLDivElement>, isVisible];
};

const StatsSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const [dueCount, setDueCount] = useState<number>(0);
  const [rotations, setRotations] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Memoized formatting functions for CountUp
  const formatSyllabi = useCallback((n: number) => formatStatNumber(n), []);
  const formatDueCount = useCallback((n: number) => formatStatNumber(n), []);
  const formatPercent = useCallback(
    (n: number) => formatStatNumber(n, true),
    [],
  );

  useEffect(() => {
    const fetchStoredCount = async () => {
      setDueCount(312000);
    };

    fetchStoredCount();

    // Listen for real-time updates
    const handleUmamiEvent = (event: CustomEvent<{ eventName: string }>) => {
      if (event?.detail?.eventName?.toLowerCase() === "due-date-added") {
        setDueCount((prev) => prev + 1);
      }
    };

    window.addEventListener("umami", handleUmamiEvent as EventListener);

    return () => {
      window.removeEventListener("umami", handleUmamiEvent as EventListener);
    };
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
    <section className="py-16 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-bold text-black sm:text-3xl lg:text-7xl">
            Students Are Crushing It
          </h2>
          <p className="mt-3 px-8 text-base text-gray-600 sm:mt-4 lg:mt-6 lg:text-lg">
            Helping students stay organized and ahead of their deadlines
          </p>
        </div>

        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 gap-8 px-8 sm:mt-12 sm:gap-12 sm:px-0 md:grid-cols-3 lg:mt-16"
        >
          {/* First Stat */}
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
            <div className="rounded-lg bg-white p-10 text-center sm:px-6">
              <h3 className="flex h-16 items-center justify-center text-7xl font-bold sm:h-20 sm:text-[9em] lg:h-24">
                <span className="text-myRed">
                  {isVisible ? (
                    <CountUp
                      end={1200}
                      suffix=""
                      duration={2.5}
                      separator=","
                      formattingFn={formatSyllabi}
                    />
                  ) : (
                    formatStatNumber(1200)
                  )}
                </span>
              </h3>
              <p className="mt-2 text-lg font-medium text-gray-900 sm:mt-4 sm:text-xl">
                Course Syllabi
              </p>
              <p className="mt-0.5 text-sm text-gray-500 sm:text-base">
                Uploaded by students
              </p>
            </div>
          </div>
          {/* Second Stat - Due Dates Tracked */}
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
            <div className="rounded-lg bg-white p-10 text-center sm:px-6">
              <h3 className="flex h-16 items-center justify-center text-7xl font-bold sm:h-20 sm:text-[9em] lg:h-24">
                <span className="text-myBlue">
                  {isVisible ? (
                    <CountUp
                      end={dueCount}
                      duration={2.5}
                      separator=","
                      formattingFn={formatDueCount}
                    />
                  ) : (
                    formatStatNumber(dueCount)
                  )}
                </span>
              </h3>
              <p className="mt-2 text-lg font-medium text-gray-900 sm:mt-4 sm:text-xl">
                Due Dates Tracked
              </p>
              <p className="mt-0.5 text-sm text-gray-500 sm:text-base">
                And counting...
              </p>
            </div>
          </div>
          {/* Third Stat */}
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
            <div className="rounded-lg bg-white p-10 text-center sm:px-6">
              <h3 className="flex h-16 items-center justify-center text-7xl font-bold sm:h-20 sm:text-[9em] lg:h-24">
                <span className="text-myOrange">
                  {isVisible ? (
                    <CountUp
                      end={94}
                      suffix="%"
                      duration={2.5}
                      formattingFn={formatPercent}
                    />
                  ) : (
                    formatStatNumber(94, true)
                  )}
                </span>
              </h3>
              <p className="mt-2 text-lg font-medium text-gray-900 sm:mt-4 sm:text-xl">
                Assignment Accuracy
              </p>
              <p className="mt-0.5 text-sm text-gray-500 sm:text-base">
                AI extraction success rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;