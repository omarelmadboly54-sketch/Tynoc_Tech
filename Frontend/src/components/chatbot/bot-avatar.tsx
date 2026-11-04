"use client";

import { cn } from "@/lib/utils";

/** Friendly animated Formio chatbot character */
export function BotAvatar({
  size = 32,
  className,
  animate = true,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden",
        animate && "animate-bot",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="url(#botGrad)" />
        {/* Face */}
        <circle cx="32" cy="34" r="18" fill="#fff" opacity="0.95" />
        {/* Eyes */}
        <ellipse cx="25" cy="32" rx="3.5" ry="4.5" fill="#5238C4">
          <animate attributeName="ry" values="4.5;1;4.5" dur="3s" repeatCount="indefinite" begin="1s" />
        </ellipse>
        <ellipse cx="39" cy="32" rx="3.5" ry="4.5" fill="#5238C4">
          <animate attributeName="ry" values="4.5;1;4.5" dur="3s" repeatCount="indefinite" begin="1s" />
        </ellipse>
        {/* Eye shine */}
        <circle cx="26.5" cy="30.5" r="1.2" fill="#fff" />
        <circle cx="40.5" cy="30.5" r="1.2" fill="#fff" />
        {/* Smile */}
        <path
          d="M24 40 Q32 48 40 40"
          stroke="#5238C4"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Antenna */}
        <line x1="32" y1="14" x2="32" y2="6" stroke="#9B7FFA" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="5" r="3" fill="#9BE7C4">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <defs>
          <linearGradient id="botGrad" x1="0" y1="0" x2="64" y2="64">
            <stop stopColor="#7457F5" />
            <stop offset="1" stopColor="#5238C4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
