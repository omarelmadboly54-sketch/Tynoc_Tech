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
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react";

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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
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
          <div className="w-full lg:w-[42%] p-8 sm:p-10 flex flex-col justify-center">
            <Logo size="md" className="mb-8" />
            <h1 className="text-2xl font-bold text-navy dark:text-navy-50">Login</h1>
            <p className="mt-1.5 text-sm text-navy-400 dark:text-navy-300">
              Welcome back to your Formio dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-navy dark:text-navy-100 mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="dark:bg-navy-900 dark:border-navy-600 dark:text-navy-50"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" loading={loading}>
                LOGIN
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative flex items-center gap-3 mb-4">
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

            <p className="mt-8 text-sm text-navy-400 dark:text-navy-300 text-center">
              No account?{" "}
              <Link href="/register" className="text-brand-600 dark:text-brand-300 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-brand-50 via-brand-100/50 to-lavender dark:from-navy-700 dark:via-navy-800 dark:to-navy-900 p-10 items-center justify-center overflow-hidden">
            <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-brand-200/40 dark:bg-brand-700/30" />
            <div className="absolute bottom-16 left-10 w-24 h-24 rounded-full bg-brand-300/30 dark:bg-brand-600/20" />
            <div className="absolute top-1/3 left-8 w-8 h-8 rounded-full bg-mint/50" />

            <div className="relative z-10 w-full max-w-md">
              <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur rounded-2xl border border-brand-100 dark:border-navy-600 shadow-brand-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <div className="w-2 h-2 rounded-full bg-brand-300" />
                  <div className="w-2 h-2 rounded-full bg-brand-200" />
                  <span className="text-xs text-navy-400 dark:text-navy-300 ml-2">Analytics overview</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-brand-50 dark:bg-navy-700 p-3">
                    <Users size={16} className="text-brand-500 mb-1" />
                    <p className="text-lg font-bold text-navy dark:text-navy-50">1.2k</p>
                    <p className="text-xs text-navy-400">Responses</p>
                  </div>
                  <div className="rounded-xl bg-mint/20 dark:bg-mint/10 p-3">
                    <TrendingUp size={16} className="text-mint-600 mb-1" />
                    <p className="text-lg font-bold text-navy dark:text-navy-50">94%</p>
                    <p className="text-xs text-navy-400">Completion</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-brand-400/80 dark:bg-brand-500/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-navy-700 flex items-center justify-center">
                    <BarChart3 size={20} className="text-brand-600" />
                  </div>
                  <span className="text-xs text-navy-400 mt-1">Charts</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-navy-700 flex items-center justify-center">
                    <PieChart size={20} className="text-brand-600" />
                  </div>
                  <span className="text-xs text-navy-400 mt-1">Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
