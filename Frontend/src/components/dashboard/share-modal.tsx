"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, MessageCircle, Mail, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  publicUrl: string;
  formTitle?: string;
}

export function ShareModal({ open, onClose, publicUrl, formTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = publicUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const message = `Hey! I'd love to hear your thoughts. Please take a moment to fill out this form: ${publicUrl}`;
  const subject = formTitle
    ? `Please fill out: ${formTitle}`
    : "I'd love your feedback";

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-white dark:bg-navy-800 rounded-2xl shadow-brand-lg border border-brand-100 dark:border-navy-600 modal-content">
        <div className="flex items-start justify-between p-5 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-navy dark:text-navy-50">Share your form</h2>
            <p className="text-sm text-navy-400 dark:text-navy-300 mt-1">
              Your form is ready! Share it with your audience and start collecting responses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-300 hover:bg-brand-50 hover:text-navy transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-xl border border-brand-200 bg-brand-50/50">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 bg-transparent text-sm text-navy font-mono truncate focus:outline-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button size="sm" onClick={copyLink} className="shrink-0">
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Link
                </>
              )}
            </Button>
          </div>

          {copied && (
            <p className="text-sm text-mint-600 font-medium text-center animate-fade-in">
              Link copied! You&apos;re ready to share.
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-100",
                "hover:bg-brand-50 hover:border-brand-200 transition-colors text-navy-400 dark:text-navy-300 hover:text-navy dark:text-navy-50"
              )}
            >
              <MessageCircle size={22} className="text-green-500" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-100",
                "hover:bg-brand-50 hover:border-brand-200 transition-colors text-navy-400 dark:text-navy-300 hover:text-navy dark:text-navy-50"
              )}
            >
              <Facebook size={22} className="text-blue-600" />
              <span className="text-xs font-medium">Facebook</span>
            </a>
            <a
              href={emailUrl}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-100",
                "hover:bg-brand-50 hover:border-brand-200 transition-colors text-navy-400 dark:text-navy-300 hover:text-navy dark:text-navy-50"
              )}
            >
              <Mail size={22} className="text-brand-500" />
              <span className="text-xs font-medium">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
