"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "mint";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary:
        "bg-brand-500 text-white hover:bg-brand-600 shadow-brand-sm hover:shadow-brand-md focus-visible:ring-brand-500",
      secondary: "bg-navy text-white hover:bg-navy-600",
      outline:
        "border-2 border-brand-200 bg-transparent text-navy hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700",
      ghost: "bg-transparent text-navy-400 hover:bg-brand-50 hover:text-brand-700",
      danger: "bg-red-600 text-white hover:bg-red-500",
      mint: "bg-mint text-navy hover:bg-mint-400 shadow-sm",
    };
    const sizes = {
      sm: "h-9 px-3.5 text-sm gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-7 text-base gap-2",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? "Please wait…" : children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
