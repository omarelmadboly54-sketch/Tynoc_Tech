"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { LayoutDashboard, Plus, LogOut, FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-navy-400 dark:text-navy-300 text-sm">
        Loading…
      </div>
    );
  }

  const nav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/forms/new", label: "New form", icon: Plus },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-14 flex items-center px-4 border-b border-brand-50 dark:border-navy-700">
        <Logo href="/" size="sm" />
      </div>
      <nav className="flex-1 p-2.5 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
                  : "text-navy-400 dark:text-navy-300 hover:bg-brand-50/50 dark:hover:bg-navy-700 hover:text-navy dark:hover:text-navy-50"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-brand-50 dark:border-navy-700 space-y-1">
        <div className="flex items-center justify-between px-2">
          <ThemeToggle />
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-navy-400 dark:text-navy-300 hover:text-navy dark:hover:text-navy-50 w-full rounded-lg hover:bg-brand-50/50 dark:hover:bg-navy-700"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-lavender/40 dark:bg-navy-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-brand-100 dark:border-navy-700 bg-white dark:bg-navy-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white dark:bg-navy-800 border-b border-brand-100 dark:border-navy-700 flex items-center px-4 justify-between">
        <Logo href="/" size="sm" />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-navy-700 text-navy dark:text-navy-50"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white dark:bg-navy-800 flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-auto pt-14 lg:pt-0">
        <div className="p-5 lg:p-7 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
