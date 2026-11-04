"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formsService } from "@/services/forms.service";
import type { Form } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/services/api-client";
import { ShareModal } from "@/components/dashboard/share-modal";
import {
  Plus,
  FileText,
  ExternalLink,
  BarChart3,
  Trash2,
  Link2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareTitle, setShareTitle] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    formsService
      .listMine(1, 50)
      .then((res) => setForms(res.forms || []))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const togglePublic = async (form: Form) => {
    setActionId(form.id);
    const nextPublic = !form.is_public;
    // Optimistic update
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, is_public: nextPublic } : f))
    );
    try {
      await formsService.updateStatus(form.id, { is_public: nextPublic });
      if (nextPublic) {
        setToast("Your form is now live! Your audience can access it and start submitting their responses.");
      }
      // Refresh to sync public_id and other fields
      const res = await formsService.listMine(1, 50);
      setForms(res.forms || []);
    } catch (e) {
      // Revert optimistic update
      setForms((prev) =>
        prev.map((f) => (f.id === form.id ? { ...f, is_public: form.is_public } : f))
      );
      alert(e instanceof ApiError ? e.message : "Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  const openShare = async (form: Form) => {
    setActionId(form.id);
    try {
      let publicId = form.public_id;
      if (!publicId) {
        const res = await formsService.createPublicLink(form.id);
        publicId = res.public_id;
        setForms((prev) =>
          prev.map((f) => (f.id === form.id ? { ...f, public_id: publicId } : f))
        );
      }
      const url = `${window.location.origin}/f/${publicId}`;
      setShareUrl(url);
      setShareTitle(form.title);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to create link");
    } finally {
      setActionId(null);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    setActionId(id);
    try {
      await formsService.delete(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setActionId(null);
    }
  };

  const published = forms.filter((f) => f.is_public).length;

  return (
    <div>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter max-w-lg w-[calc(100%-2rem)]">
          <div className="bg-white dark:bg-navy-800 border border-mint-200 dark:border-mint-700 shadow-brand-md rounded-xl px-4 py-3 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-mint-600 shrink-0 mt-0.5" />
            <p className="text-sm text-navy dark:text-navy-50 flex-1">{toast}</p>
            <button
              onClick={() => setToast(null)}
              className="text-navy-400 hover:text-navy dark:hover:text-navy-50 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-navy-50">Dashboard</h1>
          <p className="text-sm text-navy-400 dark:text-navy-300 mt-0.5">Manage your forms</p>
        </div>
        <Link href="/dashboard/forms/new">
          <Button>
            <Plus size={18} /> New form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-4">
          <div className="text-2xl font-bold text-navy dark:text-navy-50">{forms.length}</div>
          <div className="text-xs text-navy-400 dark:text-navy-300 mt-0.5">Total forms</div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-4">
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-300">{published}</div>
          <div className="text-xs text-navy-400 dark:text-navy-300 mt-0.5">Published</div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-4 hidden sm:block">
          <div className="text-2xl font-bold text-navy-400 dark:text-navy-300">
            {forms.length - published}
          </div>
          <div className="text-xs text-navy-400 dark:text-navy-300 mt-0.5">Drafts</div>
        </div>
      </div>

      {loading && <p className="text-navy-400 dark:text-navy-300 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && forms.length === 0 && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center mx-auto mb-4">
            <FileText size={22} className="text-brand-500" />
          </div>
          <p className="text-navy-400 dark:text-navy-300">No forms yet.</p>
          <Link href="/dashboard/forms/new" className="inline-block mt-4">
            <Button>Create your first form</Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-brand-600 dark:text-brand-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/dashboard/forms/${form.id}`}
                  className="font-medium text-navy dark:text-navy-50 truncate hover:text-brand-600 dark:hover:text-brand-300"
                >
                  {form.title}
                </Link>
                <Badge variant={form.is_public ? "success" : "muted"}>
                  {form.is_public ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-navy-400 dark:text-navy-300 truncate mt-0.5">
                {form.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePublic(form)}
                disabled={actionId === form.id}
                title={form.is_public ? "Unpublish" : "Publish"}
              >
                {form.is_public ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openShare(form)}
                disabled={actionId === form.id}
                title="Share public link"
              >
                <Link2 size={16} />
              </Button>
              {form.public_id && (
                <Link href={`/f/${form.public_id}`} target="_blank">
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={16} />
                  </Button>
                </Link>
              )}
              <Link href={`/dashboard/forms/${form.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Link href={`/dashboard/forms/${form.id}/submissions`}>
                <Button variant="outline" size="sm">
                  Submissions
                </Button>
              </Link>
              <Link href={`/dashboard/forms/${form.id}/analytics`}>
                <Button variant="outline" size="sm">
                  <BarChart3 size={16} />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(form.id)}
                disabled={actionId === form.id}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ShareModal
        open={!!shareUrl}
        onClose={() => setShareUrl(null)}
        publicUrl={shareUrl || ""}
        formTitle={shareTitle}
      />
    </div>
  );
}
