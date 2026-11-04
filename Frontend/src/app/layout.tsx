import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "Convoform — Forms that feel like conversations",
  description:
    "Create interactive forms, turn them into conversational chatbot experiences, and collect richer responses.",
  keywords: ["forms", "conversational forms", "chatbot forms", "surveys", "convoform"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
