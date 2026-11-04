"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/services/api-client";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { PasswordStrength } from "@/components/common/password-strength";
import { BarChart3, MessageSquare, Share2, Shield } from "lucide-react";

function SocialComingSoon({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShow(true);
          setTimeout(() => setShow(false), 3000);
        }}
        className="w-full h-11 rounded-xl border-2 border-brand-100 dark:border-navy-600 bg-white dark:bg-navy-800 text-sm font-medium text-navy dark:text-navy-50 hover:border-brand-300 dark:hover:border-brand-500 transition flex items-center justify-center gap-2"
      >
        {label}
      </button>
      {show && (
        <div className="absolute inset-x-0 -bottom-10 text-center text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 rounded-lg py-1.5 px-2 z-10">
          Coming Soon! Social login will be available in a future update.
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-lavender/40 dark:bg-navy-900">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white dark:bg-navy-800 rounded-3xl border-2 border-brand-100 dark:border-navy-600 shadow-brand-md overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-[48%] p-8 sm:p-10 flex flex-col justify-center">
            <Logo size="md" className="mb-6" />
            <h1 className="text-2xl font-bold text-navy dark:text-navy-50">Create account</h1>
            <p className="mt-1.5 text-sm text-navy-400 dark:text-navy-300">
              Start building conversational forms in minutes.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">
                    First name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="dark:bg-navy-900 dark:border-navy-600 dark:text-navy-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">
                    Last name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="dark:bg-navy-900 dark:border-navy-600 dark:text-navy-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="dark:bg-navy-900 dark:border-navy-600 dark:text-navy-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="dark:bg-navy-900 dark:border-navy-600 dark:text-navy-50"
                />
                <PasswordStrength password={password} />
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" loading={loading}>
                Create account
              </Button>
            </form>

            <div className="mt-5">
              <div className="relative flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-brand-100 dark:bg-navy-600" />
                <span className="text-xs text-navy-400 dark:text-navy-300">or continue with</span>
                <div className="flex-1 h-px bg-brand-100 dark:bg-navy-600" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SocialComingSoon label="Google" />
                <SocialComingSoon label="Facebook" />
                <SocialComingSoon label="X" />
              </div>
            </div>

            <p className="mt-6 text-sm text-navy-400 dark:text-navy-300 text-center">
              Already have one?{" "}
              <Link href="/login" className="text-brand-600 dark:text-brand-300 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-brand-50 via-brand-100/50 to-lavender dark:from-navy-700 dark:via-navy-800 dark:to-navy-900 p-10 items-center justify-center overflow-hidden">
            <div className="absolute top-10 right-16 w-20 h-20 rounded-full bg-brand-200/40 dark:bg-brand-700/30" />
            <div className="absolute bottom-20 left-12 w-28 h-28 rounded-full bg-brand-300/30 dark:bg-brand-600/20" />

            <div className="relative z-10 space-y-4 max-w-sm">
              <h2 className="text-2xl font-bold text-navy dark:text-navy-50">
                Forms that feel like conversations
              </h2>
              <p className="text-sm text-navy-400 dark:text-navy-300">
                Create, publish, and share conversational forms. Collect richer responses with a chatbot experience.
              </p>
              <ul className="space-y-3 mt-6">
                {[
                  { icon: MessageSquare, text: "Chat-style form experiences" },
                  { icon: Share2, text: "Share via WhatsApp, Email, SMS" },
                  { icon: BarChart3, text: "Real-time analytics & insights" },
                  { icon: Shield, text: "Secure & private by default" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 shadow-sm flex items-center justify-center">
                      <item.icon size={16} className="text-brand-600" />
                    </div>
                    <span className="text-sm text-navy dark:text-navy-100">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
