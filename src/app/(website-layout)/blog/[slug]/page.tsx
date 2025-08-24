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
import { WebPageJsonLd, ArticleJsonLd, BreadcrumbJsonLd } from "next-seo";
import { appConfig } from "@/lib/config";

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

async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(slug, blog.frontmatter.tags);

  return (
    <article className="max-w-6xl mx-auto py-6 md:py-10 px-4">
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
        title={blog.frontmatter.title}
        description={blog.frontmatter.description || ""}
        lastUpdated={blog.frontmatter.createdDate}
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL,
        }}
      />
      <ArticleJsonLd
        useAppDir
        type="BlogPosting"
        url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
        title={blog.frontmatter.title}
        images={[blog.frontmatter.featuredImage || `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`]}
        datePublished={blog.frontmatter.createdDate}
        dateModified={blog.frontmatter.createdDate}
        authorName={appConfig.projectName}
        description={blog.frontmatter.description || ""}
        isAccessibleForFree={true}
        publisherName={appConfig.projectName}
        publisherLogo={`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`}
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
          {
            position: 3,
            name: blog.frontmatter.title,
            item: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
          },
        ]}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary flex items-center">
          <Home className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Home</span>
        </Link>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium truncate text-foreground/90" aria-current="page">
          {blog.frontmatter.title}
        </span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        <main className="max-w-4xl">
          {/* Featured Image */}
          {blog.frontmatter.featuredImage && (
            <figure className="relative w-full h-48 sm:h-[400px] mb-6 md:mb-8 dark:opacity-80">
              <Image
                src={blog.frontmatter.featuredImage}
                alt={blog.frontmatter.title}
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </figure>
          )}

          {/* Title for mobile */}
          <header className="lg:hidden">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {blog.frontmatter.title}
            </h1>
          </header>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <time dateTime={blog.frontmatter.createdDate}>
                {new Date(blog.frontmatter.createdDate).toLocaleDateString()}
              </time>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4" aria-hidden="true" />
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
          <nav className="lg:hidden mb-8" aria-label="Table of Contents">
            <div className="rounded-lg border bg-foreground/10 p-4">
              <TableOfContents headings={blog.headings} />
            </div>
          </nav>

          {/* Content */}
          <div
            className={cn(
              "prose max-w-none",
              // Base styles
              "prose-headings:scroll-mt-20 prose-headings:font-bold",
              "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg",
              "prose-img:rounded-lg",
              "prose-a:text-primary prose-a:hover:text-primary/90",
              "prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
              // Responsive prose sizes
              "prose-sm sm:prose-base md:prose-lg",
              // Dark mode styles (if needed)
              "dark:prose-invert"
            )}
          >
            {blog.content}
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <section className="mt-12 md:mt-16" aria-labelledby="related-articles">
              <h2 id="related-articles" className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedBlogs.map((related) => (
                  <article key={related.slug} className="group">
                    <Link href={`/blog/${related.slug}`}>
                      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        {related.frontmatter.featuredImage && (
                          <figure className="relative w-full h-36">
                            <Image
                              src={related.frontmatter.featuredImage}
                              alt={related.frontmatter.title}
                              fill
                              className="object-cover shadow-xs"
                            />
                          </figure>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {related.frontmatter.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {/* Table of Contents */}
            <nav aria-label="Table of Contents">
              <TableOfContents headings={blog.headings} />
            </nav>
          </div>
        </aside>
      </div>
      <footer className="mt-16">
        <CTA2 />
      </footer>
    </article>
  );
}

export default BlogDetailPage;
