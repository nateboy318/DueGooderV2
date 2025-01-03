import { getBlogBySlug, getAllBlogs, getRelatedBlogs } from "@/lib/mdx/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, ChevronRight, Home, Tag } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import { Metadata } from "next";
import { TableOfContents } from "@/components/table-of-contents";
import { cn } from "@/lib/utils";
import { CTA2 } from "@/components/website/cta-2";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {};
  }

  const ogImage = blog.frontmatter.featuredImage || `/images/og.png`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
    keywords: blog.frontmatter.tags,
    openGraph: {
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      type: "article",
      url: `/blog/${blog.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.frontmatter.title,
        },
      ],
      publishedTime: blog.frontmatter.createdDate,
      tags: blog.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(slug, blog.frontmatter.tags);

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10 px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary flex items-center">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium truncate text-foreground/90">
          {blog.frontmatter.title}
        </span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        <div className="max-w-4xl">
          {/* Featured Image */}
          {blog.frontmatter.featuredImage && (
            <div className="relative w-full h-48 sm:h-[400px] mb-6 md:mb-8 dark:opacity-80">
              <Image
                src={blog.frontmatter.featuredImage}
                alt={blog.frontmatter.title}
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Title for mobile */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 lg:hidden">
            {blog.frontmatter.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.frontmatter.createdDate}>
                {new Date(blog.frontmatter.createdDate).toLocaleDateString()}
              </time>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4" />
              {blog.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-foreground/10 px-2 py-1 rounded-full text-xs text-foreground/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share button */}
          <ShareButton
            title={blog.frontmatter.title}
            description={blog.frontmatter.description}
          />

          {/* Mobile Table of Contents */}
          <div className="lg:hidden mb-8">
            <div className="rounded-lg border bg-foreground/10 p-4">
              <TableOfContents headings={blog.headings} />
            </div>
          </div>

          {/* Content */}
          <article
            className={cn(
              "prose max-w-none",
              // Base styles
              "prose-headings:scroll-mt-20 prose-headings:font-bold",
              "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg",
              "prose-img:rounded-lg",
              "prose-a:text-primary hover:prose-a:text-primary/90",
              "prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
              // Responsive prose sizes
              "prose-sm sm:prose-base md:prose-lg",
              // Dark mode styles (if needed)
              "dark:prose-invert"
            )}
          >
            {blog.content}
          </article>

          {/* Tip: Mobile CTA can be placed here */}

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedBlogs.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      {related.frontmatter.featuredImage && (
                        <div className="relative w-full h-36">
                          <Image
                            src={related.frontmatter.featuredImage}
                            alt={related.frontmatter.title}
                            fill
                            className="object-cover shadow-sm"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {related.frontmatter.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {/* Table of Contents */}
            <TableOfContents headings={blog.headings} />

            {/* Tip: Sidebar CTA can be placed here */}
          </div>
        </div>
      </div>
      <CTA2 />
    </div>
  );
}

export default UseCaseDetailPage;
