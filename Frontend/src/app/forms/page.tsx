"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { formsService } from "@/services/forms.service";
import type { Form } from "@/types/form";
import { ApiError } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Search, Inbox } from "lucide-react";

export default function PublicFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    formsService
      .listPublic(page, 20)
      .then((res) => setForms(res.forms || []))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Failed to load forms")
      )
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search.trim()
    ? forms.filter(
        (f) =>
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          f.description?.toLowerCase().includes(search.toLowerCase())
      )
    : forms;

  return (
    <div className="min-h-screen bg-lavender/30">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-navy">Explore Forms</h1>
            <p className="mt-2 text-navy-400 max-w-md mx-auto">
              Browse published forms and start a conversation.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input
              type="search"
              placeholder="Search forms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-brand-100 bg-white text-sm text-navy placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
            />
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-brand-100 p-6 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 mb-4" />
                  <div className="h-5 bg-brand-50 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-brand-50 rounded w-full mb-1" />
                  <div className="h-4 bg-brand-50 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setPage(1)}
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-brand-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <Inbox size={24} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-navy">No published forms yet</h3>
              <p className="text-sm text-navy-400 mt-1 max-w-xs mx-auto">
                {search
                  ? "No forms match your search."
                  : "When forms are published, they'll appear here."}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((form) => (
                  <Link
                    key={form.id}
                    href={`/forms/${form.id}`}
                    className="group bg-white rounded-2xl border border-brand-100 p-6 shadow-sm hover:shadow-brand-sm hover:border-brand-200 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                      <MessageSquare size={18} className="text-brand-600" />
                    </div>
                    <h2 className="font-semibold text-navy group-hover:text-brand-700 transition-colors line-clamp-1">
                      {form.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-navy-400 line-clamp-2 leading-relaxed">
                      {form.description || "No description"}
                    </p>
                    <div className="mt-4 flex items-center text-brand-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Start conversation <ArrowRight size={14} className="ml-1" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-navy-400 py-2">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={forms.length < 20}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
