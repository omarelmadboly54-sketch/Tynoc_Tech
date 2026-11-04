"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { analyticsService } from "@/services/analytics.service";
import { formsService } from "@/services/forms.service";
import type { FormAnalytics, QuestionAnalytics } from "@/types/analytics";
import type { OwnerFormResponse } from "@/types/form";
import { ApiError } from "@/services/api-client";
import { ArrowLeft, BarChart3, PieChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "#7457F5",
  "#9BE7C4",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#8B5CF6",
];

const YES_NO_COLORS = { yes: "#45C48A", no: "#EF4444" };

type ChartType = "bar" | "pie";

function QuestionChart({ q }: { q: QuestionAnalytics }) {
  const [chartType, setChartType] = useState<ChartType>(
    q.question_type === "yes_no" || (q.breakdown?.length || 0) <= 5 ? "pie" : "bar"
  );

  const data = useMemo(
    () =>
      (q.breakdown || []).map((b) => ({
        name: b.answer,
        value: b.count,
        percentage: b.percentage,
      })),
    [q.breakdown]
  );

  if (!data.length) {
    return (
      <p className="mt-3 text-sm text-navy-400 dark:text-navy-300">
        No breakdown for this question type.
      </p>
    );
  }

  const getColor = (name: string, index: number) => {
    if (q.question_type === "yes_no") {
      const lower = name.toLowerCase();
      if (lower === "yes") return YES_NO_COLORS.yes;
      if (lower === "no") return YES_NO_COLORS.no;
    }
    return CHART_COLORS[index % CHART_COLORS.length];
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-3 mb-2">
        <button
          onClick={() => setChartType("bar")}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            chartType === "bar"
              ? "bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300"
              : "text-navy-400 hover:bg-brand-50 dark:hover:bg-navy-700"
          )}
          title="Bar chart"
        >
          <BarChart3 size={16} />
        </button>
        <button
          onClick={() => setChartType("pie")}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            chartType === "pie"
              ? "bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300"
              : "text-navy-400 hover:bg-brand-50 dark:hover:bg-navy-700"
          )}
          title="Pie chart"
        >
          <PieChart size={16} />
        </button>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0FF" className="dark:opacity-20" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B6B8A" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#6B6B8A" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E8E0FF",
                  fontSize: 13,
                }}
                formatter={(value: number, _name: string, props: { payload?: { percentage?: number } }) => [
                  `${value} (${(props.payload?.percentage ?? 0).toFixed(0)}%)`,
                  "Count",
                ]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.name, i)} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <RePieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.name, i)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}`, name]}
                contentStyle={{ borderRadius: 12, border: "1px solid #E8E0FF", fontSize: 13 }}
              />
              <Legend />
            </RePieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="mt-3 space-y-1.5">
        {data.map((b, i) => (
          <div key={b.name} className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-navy-700 dark:text-navy-200">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getColor(b.name, i) }}
              />
              {b.name}
            </span>
            <span className="text-navy-400 dark:text-navy-300">
              {b.value} ({b.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        href={`/dashboard/forms/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-navy-400 dark:text-navy-300 hover:text-navy dark:hover:text-navy-50 mb-6"
      >
        <ArrowLeft size={16} /> Back to form
      </Link>
      <h1 className="text-2xl font-bold text-navy dark:text-navy-50">Analytics</h1>
      <p className="text-sm text-navy-400 dark:text-navy-300 mt-0.5 mb-8">{form?.title || "Form"}</p>

      {loading && <p className="text-navy-400 dark:text-navy-300">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {analytics && (
        <>
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-6 shadow-sm mb-6">
            <p className="text-sm text-navy-400 dark:text-navy-300">Total submissions</p>
            <p className="text-3xl font-bold text-navy dark:text-navy-50 mt-1">
              {analytics.total_submissions}
            </p>
          </div>

          <div className="space-y-6">
            {(analytics.questions || []).map((q) => (
              <div
                key={q.question_id}
                className="bg-white dark:bg-navy-800 rounded-2xl border border-brand-100 dark:border-navy-700 p-6 shadow-sm"
              >
                <h3 className="font-medium text-navy dark:text-navy-50">{q.question_text}</h3>
                <p className="text-xs text-navy-400 dark:text-navy-300 mt-1 capitalize">
                  {q.question_type.replace("_", " ")} · {q.total_answers} answers
                </p>
                <QuestionChart q={q} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
