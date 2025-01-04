import { getPolicyBySlug } from "@/lib/mdx/policies";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyBySlug("privacy");
  if (!policy) return {};

  return {
    title: policy.frontmatter.title,
    description: policy.frontmatter.description,
  };
}

export default async function PrivacyPolicyPage() {
  const policy = await getPolicyBySlug("privacy");
  
  if (!policy) {
    notFound();
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">{policy.frontmatter.title}</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(policy.frontmatter.lastUpdated), "MMMM d, yyyy")}
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {policy.content}
      </div>
    </>
  );
}
