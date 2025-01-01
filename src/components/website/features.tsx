"use client";

import {
  LayoutDashboard,
  MessageSquare,
  LineChart,
  FileText,
  Lock,
  Zap,
  Settings,
  Users,
} from "lucide-react";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

const features = [
  {
    name: "AI-Powered Dashboard",
    description:
      "Visualize trends and gain insights at a glance with our intuitive dashboard powered by advanced AI algorithms.",
    icon: LayoutDashboard,
  },
  {
    name: "Natural Language Processing",
    description:
      "Process and analyze text data effortlessly with our state-of-the-art NLP models for sentiment analysis and more.",
    icon: MessageSquare,
  },
  {
    name: "Predictive Analytics",
    description:
      "Make data-driven decisions with our predictive analytics tools that forecast trends and identify opportunities.",
    icon: LineChart,
  },
  {
    name: "Automated Reporting",
    description:
      "Generate comprehensive reports automatically, saving time and ensuring consistent analysis across your organization.",
    icon: FileText,
  },
  {
    name: "Enterprise Security",
    description:
      "Rest easy knowing your data is protected with our enterprise-grade security features and compliance measures.",
    icon: Lock,
  },
  {
    name: "Real-time Processing",
    description:
      "Process and analyze data in real-time, enabling quick responses to changing market conditions and opportunities.",
    icon: Zap,
  },
  {
    name: "Custom Integration",
    description:
      "Seamlessly integrate our AI solutions with your existing tools and workflows through our flexible API.",
    icon: Settings,
  },
  {
    name: "Team Collaboration",
    description:
      "Enable effective team collaboration with shared workspaces, role-based access, and real-time updates.",
    icon: Users,
  },
];

export function WebsiteFeatures() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful features for powerful results
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to analyze, understand, and act on your data with
            confidence.
          </p>
        </div>

        <div className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative overflow-hidden rounded-3xl bg-muted/40 p-8 shadow-sm ring-1 ring-border/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-primary text-primary-foreground">
          <div className="px-8 py-12 sm:px-12 sm:py-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Advanced AI at your fingertips
                </h3>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  Our platform brings the power of advanced artificial intelligence
                  to your business without the complexity. Start making smarter
                  decisions today.
                </p>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <HeroVideoDialog
                  className="dark:hidden block"
                  animationStyle="top-in-bottom-out"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/feature-light.png"
                  thumbnailAlt="Feature Demo"
                />
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="top-in-bottom-out"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/feature-dark.png"
                  thumbnailAlt="Feature Demo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 