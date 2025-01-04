import fs from "fs";
import path from "path";
import compile from "./compile";

const blogsDirectory = path.join(process.cwd(), "src/content/blog");

interface BlogFrontmatter {
  title: string;
  tags: string[];
  featuredImage?: string;
  createdDate: string;
  description?: string;
}

interface Blog {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: React.ReactNode; // MDX content type from next-mdx-remote
  headings: {
    level: number;
    text: string;
    id: string;
  }[];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const realSlug = slug.replace(/\.mdx$/, "");
  const filePath = path.join(blogsDirectory, `${realSlug}.mdx`);

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, mdx } = await compile(fileContents);

    const headings = fileContents
      .split("\n")
      .filter((line: string) => line.startsWith("#"))
      .map((line: string) => {
        const match = line.match(/^(#+)\s+(.+)$/);
        if (!match) return null;
        const [, hashes, title] = match;
        return {
          level: hashes.length,
          text: title,
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };
      })
      .filter(
        (heading): heading is NonNullable<typeof heading> => heading !== null
      );

    return {
      slug: realSlug,
      frontmatter: data as unknown as BlogFrontmatter,
      content: mdx,
      headings,
    };
  } catch (error) {
    console.error("Error reading use case:", error);
    return null;
  }
}

export async function getRelatedBlogs(currentSlug: string, tags: string[]) {
  const allBlogs = await getAllBlogs();

  // Filter out the current use case and find related ones based on tags
  return (
    allBlogs
      .filter((blog) => {
        // Exclude current article
        if (blog.slug === currentSlug) return false;

        // Check if there are any matching tags
        return blog.frontmatter.tags.some((tag) =>
          tags.includes(tag.toLowerCase())
        );
      })
      // Sort by number of matching tags (most relevant first)
      .sort((a, b) => {
        const aMatches = a.frontmatter.tags.filter((tag) =>
          tags.includes(tag.toLowerCase())
        ).length;
        const bMatches = b.frontmatter.tags.filter((tag) =>
          tags.includes(tag.toLowerCase())
        ).length;
        return bMatches - aMatches;
      })
      // Limit to 3 related articles
      .slice(0, 3)
  );
}

export async function getAllBlogs(): Promise<Blog[]> {
  const files = fs
    .readdirSync(blogsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const blogs = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const blog = await getBlogBySlug(slug);

      return blog;
    })
  );

  return blogs
    .filter((blog): blog is Blog => blog !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.createdDate).getTime() -
        new Date(a.frontmatter.createdDate).getTime()
    );
}
