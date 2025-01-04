import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/api/", "/super-admin/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
