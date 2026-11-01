import { cn } from "@/lib/utils";

export function AFLogo({ size = "md", light = false }: { size?: "sm" | "md" | "lg"; light?: boolean }) {
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <span className="flex items-center gap-3">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 shadow-[0_8px_24px_-8px_rgba(217,172,69,0.6)]",
          dims
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]" stroke="#241a05" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 9.2 12.6 4.4a1.4 1.4 0 0 0-1.2 0L2.5 9.2a.7.7 0 0 0 0 1.25L12 15.6l9.5-5.15a.7.7 0 0 0 0-1.25Z" fill="#241a05" stroke="none" />
          <path d="M6.5 12.4v4.1c0 1.1 2.5 2.7 5.5 2.7s5.5-1.6 5.5-2.7v-4.1" />
          <path d="M21.5 10.2v4.3" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-ink-950" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg",
            light ? "text-ink-950" : "text-white"
          )}
          dir="ltr"
        >
          Academic <span className="gold-text">Future</span>
        </span>
        <span className={cn("mt-1 text-[0.62rem] font-medium tracking-[0.18em]", light ? "text-ink-700" : "text-mist-400")} dir="ltr">
          DEVELOPED BY NOVA DIGITAL
        </span>
      </span>
    </span>
  );
}

export function NovaMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid h-7 w-7 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-azure-400 to-azure-600", className)}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V4l16 16V4" />
      </svg>
      <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-gold-300" />
    </span>
  );
}

export function UniMark({ name, color, size = "md" }: { name: string; color: string | null; size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "h-9 w-9 text-[0.7rem]" : size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-xl font-display font-bold text-white", dims)}
      style={{
        background: `linear-gradient(140deg, ${color ?? "#d9ac45"}, ${color ?? "#d9ac45"}55)`,
        boxShadow: `0 8px 20px -8px ${color ?? "#d9ac45"}66`,
      }}
    >
      {letters}
    </span>
  );
}
