"use client";

import { Upload, Play, LineChart } from "lucide-react";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

const steps = [
  {
    title: "Upload Your Data",
    description:
      "Simply upload your data to our secure platform. We support various file formats and data types to ensure a seamless integration with your existing systems.",
    icon: Upload,
  },
  {
    title: "Click Start",
    description:
      "Our advanced AI algorithms automatically process and analyze your data, extracting valuable insights and patterns that would be difficult to identify manually.",
    icon: Play,
  },
  {
    title: "Get Actionable Insights",
    description:
      "Receive clear, actionable insights and recommendations based on the AI analysis. Use these insights to make data-driven decisions and improve your business strategies.",
    icon: LineChart,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Just 3 steps to get started with our AI-powered platform
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 sm:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-xl font-bold">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+4rem)] top-8 hidden h-[2px] w-[calc(100%-8rem)] bg-border sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Visual Example */}
        <div className="mt-16 rounded-3xl bg-muted/40 p-8 sm:p-12">
          <div className="relative mx-auto max-w-3xl">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/demo-light.png"
              thumbnailAlt="Product Demo"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/demo-dark.png"
              thumbnailAlt="Product Demo"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 