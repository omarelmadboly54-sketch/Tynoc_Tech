"use client";

import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-xl transition-colors",
        "text-navy-400 hover:text-brand-600 hover:bg-brand-50",
        "dark:text-navy-300 dark:hover:text-brand-300 dark:hover:bg-navy-700",
        className
      )}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
