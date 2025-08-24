"use client";

import Image from "next/image";
import Link from "next/link";

const companies = [
  {
    name: "Google Drive",
    image: "https://simpleicons.org/icons/googledrive.svg",
    url: "https://www.google.com/",
  },
  {
    name: "Product Hunt",
    image: "https://simpleicons.org/icons/producthunt.svg",
    url: "https://www.producthunt.com/",
  },
  {
    name: "X",
    image: "https://simpleicons.org/icons/x.svg",
    url: "https://x.com/",
  },
  {
    name: "Reddit",
    image: "https://simpleicons.org/icons/reddit.svg",
    url: "https://www.reddit.com/",
  },
  {
    name: "Notion",
    image: "https://simpleicons.org/icons/notion.svg",
    url: "https://www.notion.so/",
  },
  {
    name: "Indie Hackers",
    image: "https://simpleicons.org/icons/indiehackers.svg",
    url: "https://www.indiehackers.com/",
  },
];

export function CompanyLogos() {
  return (
    <div className="bg-muted/40 py-8" aria-label="Company Logos">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
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
