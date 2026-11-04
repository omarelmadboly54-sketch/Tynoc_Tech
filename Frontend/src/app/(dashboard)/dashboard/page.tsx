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
} from "lucide-react";

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareTitle, setShareTitle] = useState<string>("");

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

  const togglePublic = async (form: Form) => {
    setActionId(form.id);
    try {
      await formsService.updateStatus(form.id, { is_public: !form.is_public });
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed");
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
        load();
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
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setActionId(null);
    }
  };

  const published = forms.filter((f) => f.is_public).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-sm text-navy-400 mt-0.5">Manage your forms</p>
        </div>
        <Link href="/dashboard/forms/new">
          <Button>
            <Plus size={18} /> New form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-brand-100 p-4">
          <div className="text-2xl font-bold text-navy">{forms.length}</div>
          <div className="text-xs text-navy-400 mt-0.5">Total forms</div>
        </div>
        <div className="bg-white rounded-2xl border border-brand-100 p-4">
          <div className="text-2xl font-bold text-brand-600">{published}</div>
          <div className="text-xs text-navy-400 mt-0.5">Published</div>
        </div>
        <div className="bg-white rounded-2xl border border-brand-100 p-4 hidden sm:block">
          <div className="text-2xl font-bold text-navy-400">
            {forms.length - published}
          </div>
          <div className="text-xs text-navy-400 mt-0.5">Drafts</div>
        </div>
      </div>

      {loading && <p className="text-navy-400 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && forms.length === 0 && (
        <div className="bg-white rounded-2xl border border-brand-100 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={22} className="text-brand-500" />
          </div>
          <p className="text-navy-400">No forms yet.</p>
          <Link href="/dashboard/forms/new" className="inline-block mt-4">
            <Button>Create your first form</Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-2xl border border-brand-100 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-medium text-navy truncate">{form.title}</h2>
                <Badge variant={form.is_public ? "success" : "muted"}>
                  {form.is_public ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-navy-400 truncate mt-0.5">
                {form.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
