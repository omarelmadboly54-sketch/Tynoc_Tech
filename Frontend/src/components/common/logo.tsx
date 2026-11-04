"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

const sizes = {
  sm: { img: 28, text: "text-base" },
  md: { img: 36, text: "text-lg" },
  lg: { img: 44, text: "text-xl" },
};

export function Logo({
  href = "/",
  size = "md",
  showText = true,
  className,
  textClassName,
}: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 group", className)}>
      <Image
        src="/logo-icon.png"
        alt={APP_NAME}
        width={s.img}
        height={s.img}
        className="rounded-xl object-contain"
        priority
      />
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-navy dark:text-navy-50",
            s.text,
            textClassName
          )}
        >
          {APP_NAME}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
