import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { AFLogo, NovaMark } from "@/components/brand";

export function AuthShell({
  title,
  subtitle,
  children,
  asideTitle,
  asideSubtitle,
  asidePoints,
  image = "/images/join-arch.jpg",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  asideTitle: string;
  asideSubtitle: string;
  asidePoints: string[];
  image?: string;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="grid-bg absolute inset-0 lg:w-1/2" />
      <div className="absolute -top-32 start-[10%] h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />

      {/* Form column */}
      <div className="relative flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/"><AFLogo size="sm" /></Link>
          <Link href="/" className="btn btn-ghost !px-4 !py-2 !text-xs">
            <ArrowRight size={14} />
            العودة للرئيسية
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-[1.9rem] font-bold leading-snug text-white">{title}</h1>
          <p className="mt-2.5 text-[0.9rem] leading-7 text-mist-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>

        <div className="flex items-center justify-between text-[0.72rem] text-mist-500">
          <span>© 2026 Academic Future</span>
          <span className="flex items-center gap-1.5" dir="ltr">
            <NovaMark className="!h-5 !w-5 !rounded-md" />
            Developed by Nova Digital
          </span>
        </div>
      </div>

      {/* Visual column */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image src={image} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950 via-ink-950/70 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-ink-950/40" />
        <div className="relative flex h-full flex-col justify-end p-14">
          <span className="chip chip-gold w-fit">
            <ShieldCheck size={13} />
            بيئة مؤمّنة بالكامل
          </span>
          <h2 className="mt-5 max-w-md font-display text-[2rem] font-bold leading-[1.35] text-white">{asideTitle}</h2>
          <p className="mt-3 max-w-md text-[0.92rem] leading-8 text-mist-300">{asideSubtitle}</p>
          <ul className="mt-7 space-y-3">
            {asidePoints.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-[0.86rem] text-mist-200">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold-500/30 bg-gold-400/10 font-display text-[0.68rem] font-bold text-gold-300">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3.5 text-[0.84rem] leading-6 text-rose-200">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] px-4 py-3.5 text-[0.84rem] leading-6 text-emerald-200">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
      {message}
    </div>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel = "جارٍ المعالجة...",
}: {
  pending: boolean;
  label: string;
  pendingLabel?: string;
}) {
  return (
    <button type="submit" disabled={pending} className="btn btn-gold w-full !py-3.5 !text-[0.95rem] disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.4 6.1 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}
