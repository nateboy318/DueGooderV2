interface PolicyLayoutProps {
  children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl space-y-8 prose prose-gray dark:prose-invert">
        {children}
      </div>
    </article>
  );
} 