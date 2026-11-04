import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2EFFF",
          100: "#E8E0FF",
          200: "#D4C7FF",
          300: "#B8A3FF",
          400: "#9B7FFA",
          500: "#7457F5",
          600: "#6346E0",
          700: "#5238C4",
          800: "#422EA0",
          900: "#35267E",
          950: "#1F1650",
        },
        navy: {
          DEFAULT: "#15152B",
          50: "#F5F5F8",
          100: "#E8E8F0",
          200: "#C5C5D6",
          300: "#9A9AB5",
          400: "#6B6B8A",
          500: "#15152B",
          600: "#12122A",
          700: "#0E0E22",
          800: "#0A0A1A",
          900: "#060612",
        },
        mint: {
          DEFAULT: "#9BE7C4",
          50: "#F0FBF6",
          100: "#D9F5E8",
          200: "#B3EBD1",
          300: "#9BE7C4",
          400: "#6FD9A8",
          500: "#45C48A",
          600: "#2FA06E",
          700: "#247F57",
          800: "#1C6445",
          900: "#17523A",
        },
        lavender: {
          DEFAULT: "#F2EFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "brand-sm": "0 2px 8px -2px rgba(116, 87, 245, 0.15)",
        "brand-md": "0 8px 24px -6px rgba(116, 87, 245, 0.25)",
        "brand-lg": "0 16px 48px -12px rgba(116, 87, 245, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
