import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseOptions(options: unknown): string[] {
  if (!options) return [];
  if (Array.isArray(options)) return options.map(String);
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}
