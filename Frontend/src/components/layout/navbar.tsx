"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-navy-900/90 backdrop-blur-lg border-b border-brand-100/60 dark:border-navy-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy-400 dark:text-navy-300">
          <Link href="/#features" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
            Features
          </Link>
          <Link href="/#how" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
            How it works
          </Link>
          <Link href="/forms" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
            Forms
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-navy-700 text-navy dark:text-navy-50"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all border-t border-brand-100/60 dark:border-navy-700 bg-white dark:bg-navy-900",
          open ? "max-h-80" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          <Link
            href="/#features"
            onClick={() => setOpen(false)}
            className="py-2.5 px-2 text-navy-400 dark:text-navy-300 hover:text-brand-600 rounded-lg"
          >
            Features
          </Link>
          <Link
            href="/#how"
            onClick={() => setOpen(false)}
            className="py-2.5 px-2 text-navy-400 dark:text-navy-300 hover:text-brand-600 rounded-lg"
          >
            How it works
          </Link>
          <Link
            href="/forms"
            onClick={() => setOpen(false)}
            className="py-2.5 px-2 text-navy-400 dark:text-navy-300 hover:text-brand-600 rounded-lg"
          >
            Forms
          </Link>
          <div className="border-t border-brand-100 dark:border-navy-700 my-2" />
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Log in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
