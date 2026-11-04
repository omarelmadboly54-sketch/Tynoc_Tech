"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { submissionsService } from "@/services/submissions.service";
import { formsService } from "@/services/forms.service";
import type { SubmissionWithAnswers, Answer } from "@/types/submission";
import type { OwnerFormResponse } from "@/types/form";
import { ApiError } from "@/services/api-client";
import { ArrowLeft } from "lucide-react";

export default function SubmissionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);
  const id = Number(formId);
  const [form, setForm] = useState<OwnerFormResponse | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithAnswers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      formsService.getMine(id),
      submissionsService.list(id, page, 20),
    ])
      .then(([f, s]) => {
        setForm(f.form);
        setSubmissions(s.submissions || []);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, page]);

  // Build position map from form questions
  const positionMap = useMemo(() => {
    const map = new Map<number, number>();
    (form?.questions || []).forEach((q) => {
      map.set(q.id, q.position);
    });
    return map;
  }, [form]);

  const questionLabel = (qid: number) =>
    form?.questions?.find((q) => q.id === qid)?.question_text || `Question ${qid}`;

  // Sort answers by question position (ascending)
  const sortedAnswers = (answers: Answer[]) => {
    return [...(answers || [])].sort((a, b) => {
      const posA = positionMap.get(a.question_id) ?? a.question_id;
      const posB = positionMap.get(b.question_id) ?? b.question_id;
      return posA - posB;
    });
  };

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-navy mb-6"
      >
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-navy">Submissions</h1>
      <p className="text-sm text-navy-400 mt-0.5 mb-8">
        {form?.title || "Form"} · {submissions.length} on this page
      </p>

      {loading && <p className="text-navy-400">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && submissions.length === 0 && (
        <div className="bg-white rounded-2xl border border-brand-100 p-12 text-center text-navy-400">
          No submissions yet.
        </div>
      )}

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-brand-100 p-5 shadow-sm"
          >
            <div className="flex justify-between text-xs text-navy-300 mb-3">
              <span>#{sub.id}</span>
              <span>{new Date(sub.created_at).toLocaleString()}</span>
            </div>
            <dl className="grid sm:grid-cols-2 gap-3">
              {sortedAnswers(sub.answers).map((a) => (
                <div key={a.id}>
                  <dt className="text-xs text-navy-400">{questionLabel(a.question_id)}</dt>
                  <dd className="text-sm font-medium text-navy mt-0.5">
                    {a.answer || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="text-sm px-3 py-1.5 rounded-lg border border-brand-100 disabled:opacity-40 text-navy"
        >
          Previous
        </button>
        <span className="text-sm text-navy-400 py-1.5">Page {page}</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="text-sm px-3 py-1.5 rounded-lg border border-brand-100 text-navy"
        >
          Next
        </button>
      </div>
    </div>
  );
}
