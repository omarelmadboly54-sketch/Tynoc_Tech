"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Layers,
  Share2,
  Inbox,
  BarChart3,
  GripVertical,
  Check,
  Copy,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Animated Product Walkthrough ─── */
const WALKTHROUGH_STEPS = [
  { id: 1, label: "Open Convoform", desc: "Start creating" },
  { id: 2, label: "Create a form", desc: "Title & description" },
  { id: 3, label: "Add questions", desc: "Form builder" },
  { id: 4, label: "Reorder", desc: "Drag & drop" },
  { id: 5, label: "Publish", desc: "Make it live" },
  { id: 6, label: "Share link", desc: "Generate public URL" },
  { id: 7, label: "Visitor answers", desc: "Chatbot experience" },
  { id: 8, label: "Review & analytics", desc: "See responses" },
];

function ProductWalkthrough() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setStep((s) => (s + 1) % WALKTHROUGH_STEPS.length);
    }, 2800);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {WALKTHROUGH_STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === step ? "w-8 bg-brand-500" : "w-1.5 bg-brand-200 hover:bg-brand-300"
            )}
            aria-label={s.label}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
        {/* Step list */}
        <div className="hidden md:flex flex-col gap-1">
          {WALKTHROUGH_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-sm transition-all",
                i === step
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-navy-400 hover:bg-brand-50/50"
              )}
            >
              <span className="text-xs text-brand-400 font-mono mr-2">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Preview panel */}
        <div className="bg-white rounded-2xl border border-brand-100 shadow-brand-md overflow-hidden min-h-[340px]">
          <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>
            <span className="text-white/90 text-xs font-medium ml-2">
              {WALKTHROUGH_STEPS[step].label}
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {step === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 shadow-brand-md">
                  <MessageSquare size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-navy">Welcome to Convoform</h3>
                <p className="text-sm text-navy-400 mt-2 max-w-xs">
                  Forms that feel like conversations. Create, share, and collect responses.
                </p>
                <div className="mt-6 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium">
                  Get Started
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-navy">Create a new form</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-navy-400 mb-1 block">Title</label>
                    <div className="h-10 rounded-lg border-2 border-brand-300 bg-brand-50/50 px-3 flex items-center text-sm text-navy">
                      Customer Feedback Survey
                      <span className="animate-pulse ml-0.5 text-brand-500">|</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-navy-400 mb-1 block">Description</label>
                    <div className="h-16 rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm text-navy-400">
                      Help us improve by sharing your thoughts…
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-semibold text-navy mb-3">Add questions</h3>
                {["What is your name?", "How satisfied are you?", "Any suggestions?"].map(
                  (q, i) => (
                    <div
                      key={q}
                      className="flex items-center gap-3 p-3 rounded-xl border border-brand-100 bg-brand-50/30"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="text-sm text-navy flex-1">{q}</span>
                      <span className="text-[10px] uppercase tracking-wide text-navy-300 bg-white px-2 py-0.5 rounded">
                        {i === 1 ? "Yes/No" : "Text"}
                      </span>
                    </div>
                  )
                )}
                <div className="text-center pt-2">
                  <span className="text-xs text-brand-500 font-medium">+ Add question</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-semibold text-navy mb-3">Drag to reorder</h3>
                {["How satisfied are you?", "What is your name?", "Any suggestions?"].map(
                  (q, i) => (
                    <div
                      key={q}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border bg-white transition-all",
                        i === 0
                          ? "border-brand-400 shadow-brand-sm scale-[1.02]"
                          : "border-brand-100"
                      )}
                    >
                      <GripVertical size={16} className="text-navy-300 cursor-grab" />
                      <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="text-sm text-navy flex-1">{q}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-mint-100 flex items-center justify-center mb-4">
                  <Check size={28} className="text-mint-600" />
                </div>
                <h3 className="text-lg font-bold text-navy">Form published!</h3>
                <p className="text-sm text-navy-400 mt-2">
                  Your form is now live and ready to share.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-50 text-mint-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
                  Public
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-navy">Share your form</h3>
                <p className="text-sm text-navy-400">
                  Generate a unique public link to share via WhatsApp, SMS, or email.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-brand-200 bg-brand-50/50">
                  <span className="text-sm text-navy flex-1 truncate font-mono">
                    convoform.app/f/abc123xy
                  </span>
                  <button className="shrink-0 p-2 rounded-lg bg-brand-500 text-white">
                    <Copy size={14} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {["WhatsApp", "Email", "Copy"].map((label) => (
                    <span
                      key={label}
                      className="px-3 py-1.5 rounded-lg border border-brand-100 text-xs text-navy-400"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <MessageSquare size={14} className="text-brand-600" />
                  </div>
                  <div className="bg-brand-50 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-navy max-w-[85%]">
                    Hey there! 👋 Welcome. Ready to share your feedback?
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <MessageSquare size={14} className="text-brand-600" />
                  </div>
                  <div className="bg-brand-50 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-navy max-w-[85%]">
                    What is your name?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                    Alex
                  </div>
                </div>
                <div className="flex gap-2.5 items-center pl-10">
                  <div className="flex gap-1 px-3 py-2 bg-brand-50 rounded-2xl">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-navy">Responses & Analytics</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Responses", value: "128" },
                    { label: "Completion", value: "94%" },
                    { label: "Avg. time", value: "1:24" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-brand-50 rounded-xl p-3 text-center"
                    >
                      <div className="text-lg font-bold text-brand-600">{stat.value}</div>
                      <div className="text-[10px] text-navy-400 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-navy-400">Satisfaction</div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[40, 65, 85, 55, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-brand-400 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-navy-300 mt-4">
        {paused ? "Paused — hover away to resume" : "Auto-playing demo"}
      </p>
    </div>
  );
}

/* ─── Interactive Chatbot Demo ─── */
const DEMO_FLOW = [
  { role: "bot" as const, text: "Hey there! 👋 Welcome to Convoform. Ready to see how forms can become conversations?" },
  { role: "bot" as const, text: "What's your first name?" },
  { role: "user" as const, text: "Sam" },
  { role: "bot" as const, text: "Nice to meet you, Sam! How did you hear about us?" },
  { role: "options" as const, options: ["Search", "Friend", "Social media"] },
];

function ChatbotDemo() {
  const [messages, setMessages] = useState<{ role: string; text?: string; options?: string[] }[]>([]);
  const [phase, setPhase] = useState(0);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (phase === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setMessages([{ role: "bot", text: DEMO_FLOW[0].text }]);
        setPhase(1);
      }, 900);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { role: "bot", text: DEMO_FLOW[1].text }]);
        setPhase(2);
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleOption = (opt: string) => {
    setMessages((m) => [...m, { role: "user", text: opt }]);
    setDone(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Thanks! That's exactly how Convoform works — one question at a time, like a real conversation.",
        },
      ]);
    }, 1000);
  };

  const handleName = () => {
    setMessages((m) => [...m, { role: "user", text: "Sam" }]);
    setPhase(3);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { role: "bot", text: DEMO_FLOW[3].text },
        { role: "options", options: DEMO_FLOW[4].options },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-100 shadow-brand-lg overflow-hidden max-w-md mx-auto">
      <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <MessageSquare size={16} className="text-white" />
        </div>
        <div>
          <div className="text-white text-sm font-medium">Convoform Demo</div>
          <div className="text-white/70 text-[11px]">Interactive preview</div>
        </div>
      </div>

      <div className="h-72 overflow-y-auto p-4 space-y-3 bg-lavender/30">
        {messages.map((msg, i) => {
          if (msg.role === "options") {
            return (
              <div key={i} className="flex flex-wrap gap-2 pl-10 message-enter">
                {msg.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => !done && handleOption(opt)}
                    disabled={done}
                    className="px-3.5 py-1.5 rounded-full border border-brand-200 bg-white text-sm text-navy hover:bg-brand-50 hover:border-brand-400 transition-colors disabled:opacity-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            );
          }
          return (
            <div
              key={i}
              className={cn(
                "flex gap-2 message-enter",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare size={12} className="text-brand-600" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  msg.role === "bot"
                    ? "bg-white text-navy rounded-tl-sm shadow-sm"
                    : "bg-brand-500 text-white rounded-tr-sm"
                )}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <MessageSquare size={12} className="text-brand-600" />
            </div>
            <div className="flex gap-1 px-3 py-2.5 bg-white rounded-2xl rounded-tl-sm shadow-sm">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
            </div>
          </div>
        )}

        {phase === 2 && !done && (
          <div className="flex justify-end">
            <button
              onClick={handleName}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors flex items-center gap-1.5"
            >
              Reply as Sam <Send size={14} />
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ─── Landing Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-mint/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-6">
            <MessageSquare size={14} />
            Forms that feel like conversations
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.1]">
            Turn forms into{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              conversations
            </span>
          </h1>

          <p className="mt-6 text-lg text-navy-400 max-w-2xl mx-auto leading-relaxed">
            Create interactive forms, share them as chatbot experiences, and collect richer
            responses with higher completion rates.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Get Started <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/forms">
              <Button variant="outline" size="lg">
                Explore Forms
              </Button>
            </Link>
          </div>

          {/* Product preview in hero */}
          <div className="mt-16 max-w-lg mx-auto relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-brand-400/10 to-mint/15 rounded-3xl blur-2xl" />
            <ChatbotDemo />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-lavender/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy">Everything you need</h2>
            <p className="mt-2 text-navy-400">From builder to insights in one place.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Layers,
                title: "Interactive Form Builder",
                desc: "Create forms with different question types and arrange them through drag and drop before saving.",
              },
              {
                icon: MessageSquare,
                title: "Conversational Chatbots",
                desc: "Turn forms into interactive conversations, presenting one question at a time.",
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                desc: "Generate a unique public link to share through WhatsApp, SMS, email, and more.",
              },
              {
                icon: Inbox,
                title: "Response Management",
                desc: "Collect and review submitted responses in one organized place.",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Understand response patterns through clear statistics and visualizations.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-brand-100/80 shadow-sm hover:shadow-brand-sm transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-navy text-base">{f.title}</h3>
                <p className="mt-2 text-sm text-navy-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy">How it works</h2>
            <p className="mt-2 text-navy-400">
              A quick walkthrough of the Convoform experience.
            </p>
          </div>
          <ProductWalkthrough />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl px-8 py-14 shadow-brand-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to make forms conversational?
          </h2>
          <p className="mt-3 text-white/80 max-w-md mx-auto">
            Start building interactive chatbot forms in minutes. Free to get started.
          </p>
          <Link href="/register" className="inline-block mt-8">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 shadow-none"
            >
              Get Started free <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-100 py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div>
              <span className="font-semibold text-navy">Convoform</span>
              <p className="text-xs text-navy-300">Forms that feel like conversations.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-navy-400">
            <Link href="/#features" className="hover:text-brand-600 transition-colors">
              Features
            </Link>
            <Link href="/#how" className="hover:text-brand-600 transition-colors">
              How it works
            </Link>
            <Link href="/forms" className="hover:text-brand-600 transition-colors">
              Forms
            </Link>
            <Link href="/login" className="hover:text-brand-600 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="hover:text-brand-600 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-brand-50 text-center text-xs text-navy-300">
          © {new Date().getFullYear()} Convoform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
