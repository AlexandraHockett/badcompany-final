"use client";
import React, { memo } from "react";
import Link from "next/link";

interface ButtonProps {
  title: string;
  id?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerClass?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

const Button: React.FC<ButtonProps> = memo(
  ({
    title,
    id,
    rightIcon,
    leftIcon,
    containerClass,
    href,
    type = "button",
    disabled = false,
    onClick,
  }) => {
    // Memoize the button content for better performance
    const buttonContent = (
      <span
        className={`relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-20 ${containerClass || ""}`}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          <div>{title}</div>
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </span>
      </span>
    );

    // Use Next.js Link for internal navigation
    if (href) {
      // Check if the href is an external URL
      const isExternal = href.startsWith("http") || href.startsWith("mailto:");

      if (isExternal) {
        return (
          <a
            href={href}
            id={id}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
            onClick={onClick}
          >
            {buttonContent}
          </a>
        );
      } else {
        // Internal link - use Next.js Link
        return (
          <Link href={href} className="inline-block" onClick={onClick}>
            {buttonContent}
          </Link>
        );
      }
    }

    // Regular button
    return (
      <button
        id={id}
        type={type}
        disabled={disabled}
        className={`inline-block ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {buttonContent}
      </button>
    );
  }
);

// Display name for debugging
Button.displayName = "Button";

export default Button;
