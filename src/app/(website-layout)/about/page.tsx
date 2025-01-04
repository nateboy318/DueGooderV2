import { appConfig } from "@/lib/config";
import { WebPageJsonLd } from "next-seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${appConfig.projectName}`,
  description: "Learn more about our company, mission, and values.",
  openGraph: {
    title: `About Us | ${appConfig.projectName}`,
    description: "Learn more about our company, mission, and values.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: "About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | ${appConfig.projectName}`,
    description: "Learn more about our company, mission, and values.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="py-16">
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/about`}
        title={`About Us | ${appConfig.projectName}`}
        description="Learn more about our company, mission, and values."
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Hero Section */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About {appConfig.projectName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Building the future of web publishing, one post at a time.
          </p>
        </header>

        {/* Mission Section */}
        <section className="space-y-4" aria-labelledby="mission">
          <h2 id="mission" className="text-2xl font-semibold">Our Mission</h2>
          <p className="leading-relaxed text-muted-foreground">
            At {appConfig.projectName}, we believe in empowering creators with the tools they need to publish their content independently. Our platform combines the simplicity of traditional blogging with the power of modern web technologies, making it easier than ever to share your stories with the world.
          </p>
        </section>

        {/* Values Section */}
        <section className="space-y-4" aria-labelledby="values">
          <h2 id="values" className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="space-y-2">
              <h3 className="font-medium">Simplicity</h3>
              <p className="text-sm text-muted-foreground">
                We believe in making complex things simple. Our tools are powerful yet intuitive, designed to let you focus on what matters most - your content.
              </p>
            </article>
            <article className="space-y-2">
              <h3 className="font-medium">Independence</h3>
              <p className="text-sm text-muted-foreground">
                We champion the independent web. Our platform gives you full control over your content and how it&apos;s presented to the world.
              </p>
            </article>
            <article className="space-y-2">
              <h3 className="font-medium">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;re constantly pushing the boundaries of what&apos;s possible in web publishing, bringing you the latest technologies and best practices.
              </p>
            </article>
            <article className="space-y-2">
              <h3 className="font-medium">Community</h3>
              <p className="text-sm text-muted-foreground">
                We believe in the power of community. We&apos;re building tools that help creators connect with their audience and each other.
              </p>
            </article>
          </div>
        </section>
      </div>
    </article>
  );
} 