"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FormResponse } from "@/types/form";
import type { QuestionResponse } from "@/types/question";
import { parseOptions } from "@/lib/utils";
import { submissionsService } from "@/services/submissions.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api-client";

type Msg = { id: string; role: "bot" | "user"; content: string };

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-center message-enter">
      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
        <MessageSquare size={14} className="text-brand-600" />
      </div>
      <div className="flex gap-1 px-3.5 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-brand-50">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
      </div>
    </div>
  );
}

export function Chatbot({ form }: { form: FormResponse }) {
  const questions = [...(form.questions || [])].sort((a, b) => a.position - b.position);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<{ question_id: number; answer: string }[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, done, typing]);

  useEffect(() => {
    if (!typing && started && !done) {
      inputRef.current?.focus();
    }
  }, [typing, started, done, idx]);

  const current = questions[idx] as QuestionResponse | undefined;

  const start = () => {
    setStarted(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const welcome =
        form.description ||
        "Thanks for taking a moment. I'll guide you through a few questions.";
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content: `Hey there! 👋 Welcome to "${form.title}".`,
        },
      ]);
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMessages((m) => [
            ...m,
            { id: "intro", role: "bot", content: welcome },
          ]);
          if (questions[0]) {
            setTimeout(() => {
              setTyping(true);
              setTimeout(() => {
                setTyping(false);
                setMessages((m) => [
                  ...m,
                  { id: "q0", role: "bot", content: questions[0].question_text },
                ]);
              }, 600);
            }, 400);
          }
        }, 700);
      }, 500);
    }, 600);
  };

  const finish = useCallback(
    async (finalAnswers: { question_id: number; answer: string }[]) => {
      setSubmitting(true);
      setError(null);
      setTyping(true);
      try {
        await submissionsService.create(form.id, { answers: finalAnswers });
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: "done",
            role: "bot",
            content: "Thank you! Your answers have been recorded. Have a great day! ✨",
          },
        ]);
        setDone(true);
      } catch (e) {
        setTyping(false);
        setError(e instanceof ApiError ? e.message : "Submission failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [form.id]
  );

  const submitAnswer = (value: string) => {
    if (!current || typing || submitting) return;

    const display = value || "(skipped)";
    setMessages((m) => [
      ...m,
      { id: `u-${current.id}-${Date.now()}`, role: "user", content: display },
    ]);
    setInput("");
    setError(null);

    const nextAnswers = [
      ...answers,
      { question_id: current.id, answer: value },
    ];
    setAnswers(nextAnswers);

    const nextIdx = idx + 1;

    if (nextIdx >= questions.length) {
      setTimeout(() => finish(nextAnswers), 400);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: `q-${questions[nextIdx].id}`,
            role: "bot",
            content: questions[nextIdx].question_text,
          },
        ]);
        setIdx(nextIdx);
      }, 700);
    }
  };

  const handleText = (e: React.FormEvent) => {
    e.preventDefault();
    if (typing || submitting) return;
    if (!input.trim() && current?.is_required) return;
    if (!input.trim() && !current?.is_required) {
      submitAnswer("");
      return;
    }
    if (current?.question_type === "email") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
      if (!emailOk) {
        setError("Please enter a valid email address");
        return;
      }
    }
    setError(null);
    submitAnswer(input.trim());
  };

  if (!started) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-6 shadow-brand-md">
          <MessageSquare size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-navy">{form.title}</h1>
        <p className="mt-3 text-navy-400 max-w-sm leading-relaxed">
          {form.description || "A few quick questions. Answer one at a time."}
        </p>
        <Button size="lg" className="mt-8" onClick={start}>
          Start conversation <ChevronRight size={18} />
        </Button>
        <p className="mt-4 text-xs text-navy-300">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  const options = current ? parseOptions(current.options) : [];

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
      <div className="flex-1 space-y-3.5 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5 message-enter",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare size={14} className="text-brand-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                msg.role === "bot"
                  ? "bg-white text-navy rounded-tl-sm shadow-sm border border-brand-50"
                  : "bg-brand-500 text-white rounded-tr-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {typing && <TypingIndicator />}

        {!done &&
          !submitting &&
          !typing &&
          current?.question_type === "multiple_choice" && (
            <div className="flex flex-wrap gap-2 pl-10 message-enter">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => submitAnswer(opt)}
                  className="px-3.5 py-2 rounded-full border border-brand-200 bg-white text-sm text-navy hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

        {!done &&
          !submitting &&
          !typing &&
          current?.question_type === "yes_no" && (
            <div className="flex gap-2 pl-10 message-enter">
              <Button onClick={() => submitAnswer("yes")}>Yes</Button>
              <Button variant="outline" onClick={() => submitAnswer("no")}>
                No
              </Button>
            </div>
          )}

        {done && (
          <div className="flex justify-center pt-4 message-enter">
            <div className="flex items-center gap-2 text-mint-600 text-sm font-medium bg-mint-50 px-4 py-2 rounded-full">
              <CheckCircle2 size={18} /> Response submitted
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-600 message-enter">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {!done &&
        !submitting &&
        !typing &&
        current &&
        (current.question_type === "text" || current.question_type === "email") && (
          <form onSubmit={handleText} className="pt-2 flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                current.question_type === "email"
                  ? "you@email.com"
                  : "Type your answer…"
              }
              type={current.question_type === "email" ? "email" : "text"}
              autoFocus
              className="flex-1"
            />
            <Button
              type="submit"
              className="shrink-0"
              disabled={current.is_required && !input.trim()}
            >
              <Send size={18} />
            </Button>
          </form>
        )}
    </div>
  );
}
