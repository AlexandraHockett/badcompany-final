import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Define variants for our stat cards using cva
const statCardVariants = cva("rounded-lg border p-4 transition-all", {
  variants: {
    variant: {
      default: "bg-gray-800/60 border-gray-700 hover:border-gray-600",
      purple:
        "bg-purple-900/20 border-purple-700/30 hover:border-purple-500/50",
      blue: "bg-blue-900/20 border-blue-700/30 hover:border-blue-500/50",
      green: "bg-green-900/20 border-green-700/30 hover:border-green-500/50",
      amber: "bg-amber-900/20 border-amber-700/30 hover:border-amber-500/50",
      red: "bg-red-900/20 border-red-700/30 hover:border-red-500/50",
    },
    size: {
      sm: "p-3",
      default: "p-4",
      lg: "p-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface StatsCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  variant,
  size,
  onClick,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        statCardVariants({ variant, size }),
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && (
          <span
            className={cn(
              "p-1.5 rounded-full",
              variant === "purple" && "bg-purple-700/30 text-purple-300",
              variant === "blue" && "bg-blue-700/30 text-blue-300",
              variant === "green" && "bg-green-700/30 text-green-300",
              variant === "amber" && "bg-amber-700/30 text-amber-300",
              variant === "red" && "bg-red-700/30 text-red-300",
              variant === "default" && "bg-gray-700/30 text-gray-300"
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div
            className={cn(
              "text-2xl font-bold",
              variant === "purple" && "text-purple-300",
              variant === "blue" && "text-blue-300",
              variant === "green" && "text-green-300",
              variant === "amber" && "text-amber-300",
              variant === "red" && "text-red-300",
              variant === "default" && "text-white"
            )}
          >
            {value}
          </div>

          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "text-sm flex items-center gap-1 font-medium",
              trend.isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}
