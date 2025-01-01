"use client";

import Image from "next/image";

const companies = [
  { name: "Company 1", id: 10 },
  { name: "Company 2", id: 11 },
  { name: "Company 3", id: 12 },
  { name: "Company 4", id: 13 },
  { name: "Company 5", id: 14 },
  { name: "Company 6", id: 15 },
];

export function CompanyLogos() {
  return (
    <div className="bg-muted/40 py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by leading companies worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-center grayscale transition hover:grayscale-0"
            >
              <div className="relative h-12 w-32">
                <Image
                  src={`https://picsum.photos/200/100?random=${company.id}`}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 