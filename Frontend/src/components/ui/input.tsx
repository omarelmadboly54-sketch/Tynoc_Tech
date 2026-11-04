"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 px-4 rounded-xl border border-brand-100 dark:border-navy-600 bg-white dark:bg-navy-900 text-navy dark:text-navy-50 placeholder:text-navy-300 dark:placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
