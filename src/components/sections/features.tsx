import React, { useRef, useEffect, useState } from "react";

const Features = () => {
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
        threshold: 0.1,
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
    setRotations(Array(5).fill(0).map(getRandomRotation));
  }, []);

  const features = [
    {
      title: "Smart Start Dates",
      description:
        "AI suggests when to start assignments so you finish on time, stress-free.",
      color: "bg-[#EBF8FF]",
      borderColor: "border-myBlue",
      textColor: "text-gray-900",
      image: "/_static/img/feature2.JPG",
      imageStyles: {
        height: "400px",
        objectPosition: "0% 25%",
        bottom: "-200px",
      },
    },
    {
      title: "Filter by Class",
      description:
        "View one class at a time to stay focused and cut the clutter.",
      color: "bg-[#FFF5F5]",
      borderColor: "border-myRed",
      textColor: "text-gray-900",
      image: "/_static/img/feature3.JPG",
      imageStyles: {
        height: "390px",
        objectPosition: "104% 0%",
        bottom: "-190px",
      },
    },
    {
      title: "Share And Earn",
      description:
        "Invite classmates with one link. Get rewards when they join.",
      color: "bg-[#FFFAF0]",
      borderColor: "border-myOrange",
      textColor: "text-gray-900",
      image: "/_static/img/feature4.JPG",
      imageStyles: {
        height: "280px",
        objectPosition: "0% 20%",
        bottom: "-80px",
      },
    },
    {
      title: "Due Soon List",
      description:
        "Your next assignments—sorted, filtered, and easy to act on.",
      color: "bg-[#ffffff]",
      borderColor: "border-[#4CAF50]",
      textColor: "text-gray-900",
      image: "/_static/img/feature5.JPG",
      imageStyles: {
        height: "400px",
        objectPosition: "0% 25%",
        bottom: "-200px",
      },
    },
    {
      title: "AI Due Date Detection",
      description:
        "Auto-pull deadlines from any syllabus—no copy-paste needed.",
      color: "bg-[#F0DFF3]",
      borderColor: "border-[#9C27B0]",
      textColor: "text-gray-900",
      image: "/_static/img/feature1.JPG",
      imageStyles: {
        height: "200px",
        objectPosition: "50% 25%",
        bottom: "00px",
      },
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:pb-36 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="mx-auto max-w-2xl text-center"></div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-12 sm:gap-12 md:grid-cols-3 lg:mt-16">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="h-full rounded-lg bg-gray-100 p-4 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={
                hoveredIndex === index
                  ? {
                      transform: `scale(1.05) rotate(${rotations[index] || 0}deg)`,
                    }
                  : { transform: "none" }
              }
            >
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-lg bg-white transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="pl-6 pr-6 pt-6">
                    <h3
                      className={`mb-2 text-4xl font-semibold sm:text-5xl ${feature.textColor}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm text-black opacity-90 ${feature.textColor}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <div className="relative mt-8 h-[215px]">
                    <div className="absolute inset-0 pl-8">
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 rounded-tl-lg bg-myBlue pl-4 pt-8 shadow-2xl">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className={
                              "w-full object-cover " +
                              (index === 1 ? "rounded-tl-lg" : "rounded-l-lg")
                            }
                            style={{
                              position: "absolute",
                              height: feature.imageStyles.height,
                              objectPosition:
                                feature.imageStyles.objectPosition,
                              bottom: feature.imageStyles.bottom,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2">
          {features.slice(3).map((feature, index) => (
            <div
              key={index + 3}
              className="h-full rounded-lg bg-gray-100 p-4 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(index + 3)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={
                hoveredIndex === index + 3
                  ? {
                      transform: `scale(1.05) rotate(${rotations[index + 3] || 0}deg)`,
                    }
                  : { transform: "none" }
              }
            >
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-lg bg-white transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="pl-6 pr-6 pt-6">
                    <h3
                      className={`mb-2 text-4xl font-semibold sm:text-5xl ${feature.textColor}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm text-black opacity-90 ${feature.textColor}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <div className="relative mt-8 h-[215px] sm:mt-12">
                    <div className="absolute inset-0 pl-8">
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 rounded-bl-none rounded-tl-lg bg-myBlue pl-4 pt-8 shadow-2xl">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className={
                              "w-full object-cover " +
                              (index === 1 ? "rounded-tl-lg" : "rounded-l-lg")
                            }
                            style={{
                              position: "absolute",
                              height: feature.imageStyles.height,
                              objectPosition:
                                feature.imageStyles.objectPosition,
                              bottom: feature.imageStyles.bottom,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;