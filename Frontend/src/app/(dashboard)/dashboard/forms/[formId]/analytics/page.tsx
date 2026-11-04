"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { analyticsService } from "@/services/analytics.service";
import { formsService } from "@/services/forms.service";
import type { FormAnalytics } from "@/types/analytics";
import type { OwnerFormResponse } from "@/types/form";
import { ApiError } from "@/services/api-client";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);
  const id = Number(formId);
  const [form, setForm] = useState<OwnerFormResponse | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([formsService.getMine(id), analyticsService.get(id)])
      .then(([f, a]) => {
        setForm(f.form);
        setAnalytics(a.analytics);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 mb-6"
      >
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
      <p className="text-sm text-zinc-600 mt-0.5 mb-8">{form?.title || "Form"}</p>

      {loading && <p className="text-zinc-500">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {analytics && (
        <>
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm mb-6">
            <p className="text-sm text-zinc-500">Total submissions</p>
            <p className="text-3xl font-bold text-zinc-900 mt-1">{analytics.total_submissions}</p>
          </div>

          <div className="space-y-6">
            {(analytics.questions || []).map((q) => (
              <div key={q.question_id} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                <h3 className="font-medium text-zinc-900">{q.question_text}</h3>
                <p className="text-xs text-zinc-500 mt-1 capitalize">
                  {q.question_type.replace("_", " ")} · {q.total_answers} answers
                </p>
                {q.breakdown && q.breakdown.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {q.breakdown.map((b) => (
                      <div key={b.answer}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-700">{b.answer}</span>
                          <span className="text-zinc-500">
                            {b.count} ({b.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${Math.min(100, b.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">No breakdown for this question type.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
