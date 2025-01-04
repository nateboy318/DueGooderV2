interface PolicyLayoutProps {
  children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        {children}
      </div>
    </div>
  );
} 