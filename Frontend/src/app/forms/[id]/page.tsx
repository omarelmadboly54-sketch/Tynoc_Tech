"use client";

import { use, useEffect, useState } from "react";
import { formsService } from "@/services/forms.service";
import type { FormResponse } from "@/types/form";
import { Chatbot } from "@/components/chatbot/chatbot";
import { ApiError } from "@/services/api-client";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PublicFormByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const formId = Number(id);
  const [form, setForm] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId || isNaN(formId)) {
      setError("Invalid form");
      setLoading(false);
      return;
    }
    formsService
      .getById(formId)
      .then((res) => setForm(res.form))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Form not found")
      )
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-lavender/30 flex items-center justify-center">
        <div className="text-navy-400 text-sm">Loading form…</div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-lavender/30">
        <Navbar />
        <div className="pt-28 px-4 text-center">
          <p className="text-red-600">{error || "Form not found"}</p>
          <Link
            href="/forms"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-600 hover:underline"
          >
            <ArrowLeft size={16} /> Back to forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender/30 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16">
        <Chatbot form={form} />
      </div>
    </div>
  );
}
