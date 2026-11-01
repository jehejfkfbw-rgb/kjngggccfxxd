import { cn } from "@/lib/utils";

export function AFLogo({ size = "md", dark = false }: { size?: "sm" | "md" | "lg"; dark?: boolean }) {
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <span className="flex items-center gap-3">
      {/* Icon mark */}
      <span className={cn(
        "relative grid shrink-0 place-items-center rounded-2xl shadow-[0_8px_28px_-8px_rgba(79,209,197,0.7)]",
        dims
      )} style={{ background: "linear-gradient(140deg,#4fd1c5,#38b2ac 50%,#b794f4)" }}>
        <svg viewBox="0 0 24 24" fill="none" className="h-[55%] w-[55%]">
          {/* graduation cap */}
          <path d="M12 3L2 8l10 5 10-5-10-5Z" fill="rgba(4,5,15,0.9)" />
          <path d="M6 10.5v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5" stroke="rgba(4,5,15,0.9)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M20 8v4.5" stroke="rgba(4,5,15,0.9)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-space-950" />
      </span>
      {/* Text */}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg",
            dark ? "text-space-900" : "text-white"
          )}
          dir="ltr"
        >
          Academic{" "}
          <span style={{
            background: "linear-gradient(135deg,#81e6d9,#4fd1c5 40%,#b794f4)",
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
          }}>Future</span>
        </span>
        <span className={cn(
          "mt-0.5 text-[0.58rem] font-bold tracking-[0.2em]",
          dark ? "text-space-600" : "text-slate-500"
        )} dir="ltr">
          BY NOVA DIGITAL
        </span>
      </span>
    </span>
  );
}

export function NovaMark({ className }: { className?: string }) {
  return (
    <span className={cn(
      "relative grid h-7 w-7 place-items-center overflow-hidden rounded-lg",
      className
    )} style={{ background: "linear-gradient(135deg,#4fd1c5,#805ad5)" }}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V4l16 16V4" />
      </svg>
    </span>
  );
}

export function UniMark({ name, color, size = "md" }: { name: string; color: string | null; size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "h-9 w-9 text-[0.7rem]" : size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  const letters = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  const bg = color ?? "#4fd1c5";
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-xl font-display font-bold text-white", dims)}
      style={{ background: `linear-gradient(140deg,${bg},${bg}66)`, boxShadow: `0 6px 20px -6px ${bg}88` }}
    >
      {letters}
    </span>
  );
}
