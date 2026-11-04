"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formsService } from "@/services/forms.service";
import { questionsService } from "@/services/questions.service";
import { ApiError } from "@/services/api-client";
import type { QuestionType } from "@/types/question";
import { ArrowLeft, Plus, GripVertical, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type DraftQ = {
  key: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  is_required: boolean;
};

function SortableQuestion({
  q,
  index,
  onChange,
  onRemove,
}: {
  q: DraftQ;
  index: number;
  onChange: (key: string, patch: Partial<DraftQ>) => void;
  onRemove: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: q.key,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm",
        isDragging && "opacity-80 shadow-lg z-10"
      )}
    >
      <div className="flex gap-3">
        <button
          type="button"
          className="mt-2.5 text-zinc-300 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={q.question_text}
              onChange={(e) => onChange(q.key, { question_text: e.target.value })}
              placeholder={`Question ${index + 1}`}
              className="flex-1"
            />
            <select
              value={q.question_type}
              onChange={(e) =>
                onChange(q.key, { question_type: e.target.value as QuestionType })
              }
              className="h-11 px-3 rounded-xl border border-zinc-200 bg-white text-sm"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="multiple_choice">Multiple choice</option>
              <option value="yes_no">Yes / No</option>
            </select>
          </div>
          {q.question_type === "multiple_choice" && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500">Options (one per line)</p>
              <Textarea
                value={q.options.join("\n")}
                onChange={(e) =>
                  onChange(q.key, {
                    options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  })
                }
                rows={3}
                placeholder={"Option A\nOption B\nOption C"}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={q.is_required}
                onChange={(e) => onChange(q.key, { is_required: e.target.checked })}
                className="rounded border-zinc-300 text-brand-600"
              />
              Required
            </label>
            <button
              type="button"
              onClick={() => onRemove(q.key)}
              className="text-zinc-400 hover:text-red-500 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState<DraftQ[]>([
    {
      key: "1",
      question_text: "",
      question_type: "text",
      options: [],
      is_required: true,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.key === active.id);
        const newIndex = items.findIndex((i) => i.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateQ = (key: string, patch: Partial<DraftQ>) => {
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  };

  const addQ = () => {
    setQuestions((qs) => [
      ...qs,
      {
        key: String(Date.now()),
        question_text: "",
        question_type: "text",
        options: [],
        is_required: false,
      },
    ]);
  };

  const removeQ = (key: string) => {
    setQuestions((qs) => qs.filter((q) => q.key !== key));
  };

  const handleSave = async () => {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }
    if (questions.length === 0) {
      setError("Add at least one question");
      return;
    }
    for (const q of questions) {
      if (!q.question_text.trim()) {
        setError("Every question needs text");
        return;
      }
      if (q.question_type === "multiple_choice" && q.options.length < 2) {
        setError("Multiple choice needs at least 2 options");
        return;
      }
    }

    setSaving(true);
    try {
      const formRes = await formsService.create({
        title: title.trim(),
        description: description.trim(),
        is_public: isPublic,
      });
      const formId = formRes.data?.id;
      if (!formId) throw new Error("Form created but no id returned");

      // positions based on final order after drag-and-drop
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await questionsService.create(formId, {
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          options: q.question_type === "multiple_choice" ? q.options : null,
          position: i + 1,
          is_required: q.is_required,
        });
      }

      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Create form</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Customer feedback" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Shown at the start of the chat" />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded border-zinc-300 text-brand-600" />
              Publish immediately
            </label>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900">Questions</h2>
            <Button variant="outline" size="sm" onClick={addQ} type="button">
              <Plus size={16} /> Add
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={questions.map((q) => q.key)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <SortableQuestion key={q.key} q={q} index={idx} onChange={updateQ} onRemove={removeQ} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm sticky top-6">
            <h3 className="font-semibold text-zinc-900 mb-3">Save</h3>
            {error && <p className="text-sm text-red-600 mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <Button className="w-full" onClick={handleSave} loading={saving}>
              Create form
            </Button>
            <p className="mt-3 text-xs text-zinc-500">
              Drag questions to set order. Positions are sent when you create.
            </p>
          </div>

          {/* Mini preview */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-3">
              <MessageSquare size={16} className="text-brand-600" /> Chat preview
            </div>
            <div className="space-y-2 text-sm">
              {description && (
                <div className="bg-zinc-100 rounded-xl rounded-tl-sm px-3 py-2 text-zinc-700">
                  {description}
                </div>
              )}
              {questions[0]?.question_text && (
                <div className="bg-zinc-100 rounded-xl rounded-tl-sm px-3 py-2 text-zinc-700">
                  {questions[0].question_text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
