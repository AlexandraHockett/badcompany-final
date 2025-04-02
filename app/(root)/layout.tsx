//app\(root)\layout.tsx
"use client";

import { ReactNode } from "react";
import { BackgroundBeamsWithCollision } from "@/components/layout/background-beams-with-collision";

interface InnerLayoutProps {
  children: ReactNode;
}

export default function InnerLayout({ children }: InnerLayoutProps) {
  return (
    <BackgroundBeamsWithCollision>{children}</BackgroundBeamsWithCollision>
  );
}
