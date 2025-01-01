export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary py-20 text-primary-foreground">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:14px_14px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-primary/50" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
} 