"use client";

import Image from "next/image";
import Link from "next/link";

const companies = [
  {
    name: "Hacker News",
    image: "/assets/logos/company-1.svg",
    url: "https://news.ycombinator.com/",
  },
  {
    name: "Product Hunt",
    image: "/assets/logos/company-2.svg",
    url: "https://www.producthunt.com/",
  },
  {
    name: "Twitter",
    image: "/assets/logos/company-3.svg",
    url: "https://x.com/",
  },
  {
    name: "Reddit",
    image: "/assets/logos/company-4.svg",
    url: "https://www.reddit.com/",
  },
  {
    name: "BSKY",
    image: "/assets/logos/company-5.svg",
    url: "https://bsky.app/",
  },
  {
    name: "Indie Hackers",
    image: "/assets/logos/company-6.svg",
    url: "https://www.indiehackers.com/",
  },
];

export function CompanyLogos() {
  return (
    <div className="bg-muted/40 py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Featured on
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <Link
              key={company.name}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center grayscale transition hover:grayscale-0"
            >
              <div className="relative h-12 w-32">
                <Image
                  src={company.image}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
