"use client";

import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Major, UofSC",
    color: "myBlue",
    text: `Due Gooder completely transformed how I manage my coursework! The automatic syllabus parsing saved me hours of manual calendar entry, and the smart start dates help me stay ahead of deadlines.`,
    accent: "bg-myBlue",
    avatar:
      "https://images.unsplash.com/photo-1655977237812-ee6beb137203?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Marcus Johnson",
    role: "Business Administration Major, CofC",
    color: "myRed",
    text: `The Google Calendar integration is seamless! I love how it color-codes different courses and sends smart reminders. It's like having a personal academic assistant.`,
    accent: "bg-myRed",
    avatar:
      "https://images.unsplash.com/photo-1632507273499-df468b359d7d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Emily Rodriguez",
    role: "Teaching Assistant, UofL",
    color: "myOrange",
    text: `As a TA, I recommend Due Gooder to all my students. The AI extraction is incredibly accurate, and the mobile access means they never miss an assignment deadline.`,
    accent: "bg-myOrange",
    avatar:
      "https://plus.unsplash.com/premium_photo-1667511201650-7381b8e5e70b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // Add more testimonials as needed
];

export default function Testimonials() {
  const [rotations, setRotations] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Generate a random rotation between -1.5 and 1.5 degrees for each testimonial
    const getRandomRotation = () => {
      const angle = Math.random() * 1 + 0.5; // 0.5 - 1.5
      return Math.random() > 0.5 ? angle : -angle;
    };
    setRotations(Array(testimonials.length).fill(0).map(getRandomRotation));
  }, []);

  return (
    <section className="pb-12 pt-8 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-12 sm:gap-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="h-full rounded-lg bg-gray-100 p-4 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={
                hoveredIndex === i
                  ? { transform: `scale(1.05) rotate(${rotations[i] || 0}deg)` }
                  : { transform: "none" }
              }
            >
              <div className="flex h-full flex-col justify-between rounded-lg bg-white">
                <div className="flex flex-col items-center p-8 text-center">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full ${t.accent} relative mb-4`}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="absolute left-1/2 top-1/2 h-[5.2em] w-[5.2em] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                  <blockquote>
                    <p className="text-lg font-medium leading-relaxed text-gray-900">
                      &quot;{t.text}&quot;
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <p className="text-base font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="mt-1 text-sm font-normal text-gray-600">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}