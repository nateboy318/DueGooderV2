import { getAllBlogs } from "@/lib/mdx/blogs";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Metadata } from "next";
import { CTA2 } from "@/components/website/cta-2";
import { appConfig } from "@/lib/config";
import { WebPageJsonLd, BreadcrumbJsonLd } from "next-seo";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Blog | ${appConfig.projectName}`,
  description: `Discover how to use ${appConfig.projectName}`,
  openGraph: {
    title: `Blog | ${appConfig.projectName}`,
    description: `Discover how to use ${appConfig.projectName}`,
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: "Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${appConfig.projectName}`,
    description: `Discover how to use ${appConfig.projectName}`,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
  },
};

export default async function BlogListPage() {
  const blogs = await getAllBlogs();

  if (blogs.length === 0) {
    return notFound();
  }

  return (
    <article className="max-w-6xl mx-auto py-10 px-4">
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/blog`}
        title={`Blog | ${appConfig.projectName}`}
        description={`Discover how to use ${appConfig.projectName}`}
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <BreadcrumbJsonLd
        useAppDir
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: process.env.NEXT_PUBLIC_APP_URL,
          },
          {
            position: 2,
            name: "Blog",
            item: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
          },
        ]}
      />

      {/* Hero Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover how to use {appConfig.projectName} to get most out of it.
        </p>
      </header>

      {/* Blog Posts Grid */}
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.slug} className="flex flex-col">
              <Link href={`/blog/${blog.slug}`} className="group">
                <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  {/* Featured Image */}
                  {blog.frontmatter.featuredImage && (
                    <figure className="relative w-full h-48">
                      <Image
                        src={blog.frontmatter.featuredImage}
                        alt={blog.frontmatter.title}
                        fill
                        className="object-cover shadow-xs"
                      />
                    </figure>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <header>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {blog.frontmatter.title}
                      </h2>
                    </header>
                    <p className="text-foreground/60 mb-4 line-clamp-2">
                      {blog.frontmatter.description}
                    </p>

                    {/* Tags */}
                    <footer className="flex flex-wrap gap-2">
                      {blog.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs text-foreground/60 bg-foreground/10 px-3 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </footer>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="mt-16">
        <CTA2 />
      </footer>
    </article>
  );
}
