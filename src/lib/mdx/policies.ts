import fs from "fs";
import path from "path";
import compile from "./compile";

const policiesDirectory = path.join(process.cwd(), "src/content/policies");

interface PolicyFrontmatter {
  title: string;
  lastUpdated: string;
  description?: string;
}

interface Policy {
  slug: string;
  frontmatter: PolicyFrontmatter;
  content: React.ReactNode;
}

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  const realSlug = slug.replace(/\.md$/, "");
  const filePath = path.join(policiesDirectory, `${realSlug}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, mdx } = await compile(fileContents);

    return {
      slug: realSlug,
      frontmatter: data as unknown as PolicyFrontmatter,
      content: mdx,
    };
  } catch (error) {
    console.error("Error reading policy:", error);
    return null;
  }
} 