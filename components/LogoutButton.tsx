"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  className?: string;
  variant?: "icon" | "text" | "full";
  redirectUrl?: string;
}

export default function LogoutButton({
  className,
  variant = "full",
  redirectUrl = "/",
}: LogoutButtonProps) {
  const { data: session } = useSession();

  // Don't render if no session exists
  if (!session) return null;

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: redirectUrl,
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        className={`text-red-500 hover:text-red-600 ${className}`}
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleLogout}
        className={`text-red-500 hover:text-red-600 ${className}`}
      >
        Logout
      </button>
    );
  }

  // Full variant (default)
  return (
    <Button variant="destructive" onClick={handleLogout} className={className}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
}
