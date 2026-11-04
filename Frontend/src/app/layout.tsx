import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description:
    "Create interactive conversational forms, turn them into chatbot experiences, and collect richer responses with Formio.",
  keywords: ["forms", "conversational forms", "chatbot forms", "surveys", "formio"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-navy dark:bg-navy-900 dark:text-navy-50 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
