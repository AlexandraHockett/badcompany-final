"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterModal from "@/components/NewsletterModal";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    // For admin routes, render only the children (DashboardLayout content)
    return <>{children}</>;
  }

  // For non-admin routes, render the full layout with Header, Footer, and NewsletterModal
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
        <NewsletterModal />
      </main>
      <Footer />
    </>
  );
}
