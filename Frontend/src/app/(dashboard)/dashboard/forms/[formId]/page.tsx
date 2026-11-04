"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { formsService } from "@/services/forms.service";
import type { OwnerFormResponse } from "@/types/form";
import { ApiError } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Inbox, ListOrdered } from "lucide-react";
import { parseOptions } from "@/lib/utils";

export default function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);
  const id = Number(formId);
  const [form, setForm] = useState<OwnerFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    formsService
      .getMine(id)
      .then((res) => setForm(res.form))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load form"))
      .finally(() => setLoading(false));
  }, [id]);

  const questions = [...(form?.questions || [])].sort((a, b) => a.position - b.position);

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-navy-400 dark:text-navy-300 hover:text-navy dark:hover:text-navy-50 mb-6"
      >
        <ArrowLeft size={16} /> Dashboard
      </Link>

      {loading && <p className="text-navy-400 dark:text-navy-300 text-sm">Loading form…</p>}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {form && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-navy dark:text-navy-50">{form.title}</h1>
                <Badge variant={form.is_public ? "success" : "muted"}>
                  {form.is_public ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-navy-400 dark:text-navy-300 mt-1 max-w-xl">
                {form.description}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/dashboard/forms/${id}/submissions`}>
                <Button variant="outline" size="sm">
                  <Inbox size={16} /> Submissions
                </Button>
              </Link>
              <Link href={`/dashboard/forms/${id}/analytics`}>
                <Button variant="outline" size="sm">
                  <BarChart3 size={16} /> Analytics
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <ListOrdered size={18} className="text-brand-500" />
              <h2 className="font-semibold text-navy dark:text-navy-50">
                Questions ({questions.length})
              </h2>
            </div>

            {questions.length === 0 ? (
              <p className="text-sm text-navy-400 dark:text-navy-300">
                No questions on this form yet.
              </p>
            ) : (
              <ol className="space-y-4">
                {questions.map((q, i) => {
                  const opts = parseOptions(q.options);
                  return (
                    <li
                      key={q.id}
                      className="flex gap-3 p-4 rounded-xl bg-brand-50/50 dark:bg-navy-700/50 border border-brand-50 dark:border-navy-600"
                    >
                      <span className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-navy dark:text-navy-50 text-sm">
                          {q.question_text}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-navy-800 text-navy-400 dark:text-navy-300 border border-brand-100 dark:border-navy-600 capitalize">
                            {String(q.question_type).replace("_", " ")}
                          </span>
                          {q.is_required && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800">
                              Required
                            </span>
                          )}
                        </div>
                        {opts.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {opts.map((o, j) => (
                              <li
                                key={j}
                                className="text-xs text-navy-400 dark:text-navy-300 flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                                {o}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </>
      )}
    </div>
  );
}
