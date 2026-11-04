import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "muted";
  className?: string;
}) {
  const variants = {
    default: "bg-brand-100 text-brand-800",
    success: "bg-mint-100 text-mint-700",
    muted: "bg-navy-100 text-navy-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
