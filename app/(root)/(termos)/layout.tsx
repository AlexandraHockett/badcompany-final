import { ReactNode } from "react";

interface TermosLayoutProps {
  children: ReactNode;
}

export default function TermosLayout({ children }: TermosLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-24 sm:py-36 md:py-40">
      {children}
    </div>
  );
}
