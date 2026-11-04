"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[#?!@$%^&*\-_=+]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  let level: "weak" | "medium" | "strong" = "weak";
  let label = "Weak";
  let color = "bg-red-500";
  if (score >= 5) {
    level = "strong";
    label = "Strong";
    color = "bg-emerald-500";
  } else if (score >= 3) {
    level = "medium";
    label = "Medium";
    color = "bg-amber-500";
  }
  return { checks, score, level, label, color, percent: (score / 5) * 100 };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const requirements = [
    { key: "length", label: "At least 8 characters", ok: strength.checks.length },
    { key: "upper", label: "One uppercase letter", ok: strength.checks.upper },
    { key: "lower", label: "One lowercase letter", ok: strength.checks.lower },
    { key: "number", label: "One number", ok: strength.checks.number },
    { key: "special", label: "One special character (#, !, @, …)", ok: strength.checks.special },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-navy-100 dark:bg-navy-700 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", strength.color)}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
        <span
          className={cn(
            "text-xs font-medium",
            strength.level === "strong" && "text-emerald-600 dark:text-emerald-400",
            strength.level === "medium" && "text-amber-600 dark:text-amber-400",
            strength.level === "weak" && "text-red-600 dark:text-red-400"
          )}
        >
          {strength.label}
        </span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {requirements.map((r) => (
          <li
            key={r.key}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              r.ok ? "text-emerald-600 dark:text-emerald-400" : "text-navy-400 dark:text-navy-300"
            )}
          >
            {r.ok ? <Check size={12} /> : <X size={12} />}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
