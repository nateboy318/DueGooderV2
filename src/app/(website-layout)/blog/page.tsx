import { getAllBlogs } from "@/lib/mdx/blogs";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Metadata } from "next";
import { CTA2 } from "@/components/website/cta-2";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Blog`,
  description: `Discover how to use ${appConfig.projectName}`,
  openGraph: {
    title: `Blog`,
    description: `Discover how to use ${appConfig.projectName}`,
    type: "website",
    url: "/blog",
  },
};

export default async function BlogListPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover how to use {appConfig.projectName} to get most out of it.
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group">
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Featured Image */}
              {blog.frontmatter.featuredImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={blog.frontmatter.featuredImage}
                    alt={blog.frontmatter.title}
                    fill
                    className="object-cover shadow-sm"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {blog.frontmatter.title}
                </h2>
                <p className="text-foreground/60 mb-4 line-clamp-2">
                  {blog.frontmatter.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blog.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs text-foreground/60 bg-foreground/10 px-3 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CTA2 />
    </div>
  );
}
