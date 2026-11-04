"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { formsService } from "@/services/forms.service";
import type { FormResponse } from "@/types/form";
import { Chatbot } from "@/components/chatbot/chatbot";
import { MessageSquare } from "lucide-react";
import { ApiError } from "@/services/api-client";

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = use(params);
  const [form, setForm] = useState<FormResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    formsService
      .getByPublicId(publicId)
      .then((res) => setForm(res.form))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Form not found or unavailable")
      )
      .finally(() => setLoading(false));
  }, [publicId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender/30 text-navy-400 text-sm">
        Loading…
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-lavender/30">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-navy">Form unavailable</h1>
          <p className="mt-2 text-navy-400 text-sm">
            {error || "This form may be private or removed."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-brand-600 text-sm hover:underline"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender/30 flex flex-col">
      <header className="border-b border-brand-100 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-brand-600" />
            </div>
            <span className="font-medium text-navy text-sm truncate">{form.title}</span>
          </div>
          <span className="text-xs text-navy-300 shrink-0">Powered by Formio</span>
        </div>
      </header>
      <Chatbot form={form} />
    </div>
  );
}
