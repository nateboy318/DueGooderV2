"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colors = ["bg-myBlue", "bg-myRed", "bg-myOrange"];

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 4000);

    return () => clearInterval(colorInterval);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing video:", error);
          });
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsControlsVisible(false);
        }, 1000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsControlsVisible(true);
  };

  return (
    <section
      className={`w-full ${colors[currentColorIndex]} py-12 transition-colors duration-700 sm:py-24`}
    >
      <div className="container mx-auto px-4 xl:px-0">
        <div
          className="relative mx-auto aspect-video w-full max-w-7xl overflow-hidden rounded-md bg-black/5"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        >
          <video
            ref={videoRef}
            className="size-full rounded-md bg-gray-100 object-cover p-2 sm:p-4"
            onEnded={handleVideoEnd}
            playsInline
            preload="metadata"
            poster="/_static/img/demo_thumbnail.png"
          >
            <source src="/video/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Controls */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isControlsVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "0.3s" }}
          >
            <button
              data-umami-event="Demo Video Played"
              onClick={togglePlay}
              className="group relative z-10 flex size-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105 focus:outline-none active:scale-95"
            >
              {isPlaying ? (
                <Pause
                  className={`size-8 ${colors[currentColorIndex].replace(
                    "bg-",
                    "text-",
                  )}`}
                />
              ) : (
                <Play
                  className={`size-8 ${colors[currentColorIndex].replace(
                    "bg-",
                    "text-",
                  )} translate-x-0.5`}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;