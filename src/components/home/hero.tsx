"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, GraduationCap, Landmark, Sparkles, Zap } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Counter, Reveal } from "@/components/motion";

export function Hero({
  universitiesCount,
  studentsCount,
  syncsCount,
}: {
  universitiesCount: number;
  studentsCount: number;
  syncsCount: number;
}) {
  const { t, lang } = useLang();

  return (
    <section className="relative overflow-hidden pb-20 pt-[130px] md:pb-28 md:pt-[180px]">
      {/* Background orbs */}
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -top-48 start-[5%] h-[500px] w-[500px] rounded-full animate-drift"
        style={{ background: "radial-gradient(circle, rgba(79,209,197,0.12) 0%, transparent 70%)" }} />
      <div className="absolute -top-32 end-[3%] h-[420px] w-[420px] rounded-full animate-drift"
        style={{ background: "radial-gradient(circle, rgba(159,122,234,0.1) 0%, transparent 70%)", animationDelay: "-7s" }} />
      <div className="absolute bottom-0 start-1/2 h-[300px] w-[700px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, rgba(79,209,197,0.06) 0%, transparent 70%)" }} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        {/* ─── Left: Copy ─── */}
        <div>
          <Reveal>
            <span className="chip chip-teal !text-[0.72rem] !py-1.5">
              <Sparkles size={12} />
              {t.hero.badge}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-bold leading-[1.1] tracking-tight text-white">
              {t.hero.titleA}
              <br />
              <span className="animate-shine" style={{
                background: "linear-gradient(110deg,#b2f5ea,#4fd1c5 25%,#b794f4 50%,#4fd1c5 75%,#b2f5ea)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                backgroundSize: "200% auto"
              }}>
                {t.hero.titleB}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[1rem] leading-8 text-slate-400">{t.hero.sub}</p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/login/student" className="btn btn-primary !px-8 !py-3.5 !text-[0.95rem]">
                <GraduationCap size={18} />
                {t.hero.ctaStudent}
                <ArrowLeft size={15} className="rtl:rotate-180" />
              </Link>
              <Link href="/join" className="btn btn-ghost !px-8 !py-3.5 !text-[0.95rem]">
                <Landmark size={16} />
                {t.hero.ctaJoin}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-5">
              {[
                { v: universitiesCount, l: t.hero.uniWord },
                { v: studentsCount, l: t.hero.studentWord },
                { v: syncsCount, l: t.hero.liveOps },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[2.2rem] font-bold leading-none"
                    style={{ background: "linear-gradient(135deg,#4fd1c5,#b794f4)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                    <Counter to={s.v} />
                  </p>
                  <p className="mt-1.5 text-[0.75rem] text-slate-500">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ─── Right: Visual ─── */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[560px]">
            {/* Main image */}
            <div className="ring-teal relative overflow-hidden rounded-[2rem] shadow-[0_60px_120px_-40px_rgba(4,5,15,0.95)]">
              <Image
                src="/images/hero-campus.jpg"
                alt="Academic Future campus"
                width={1080} height={760}
                priority
                className="h-[380px] w-full object-cover md:h-[460px]"
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, rgba(4,5,15,0.92) 0%, rgba(7,11,26,0.5) 50%, rgba(7,11,26,0.1) 100%)"
              }} />
              <div className="absolute bottom-5 start-5 end-5">
                <p className="text-[0.65rem] font-bold tracking-[0.18em] text-teal-400" dir="ltr">ACADEMIC FUTURE PLATFORM</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">
                  {lang === "ar" ? "منصة جامعية مركزية موثوقة" : "Trusted Central University Platform"}
                </p>
              </div>
            </div>

            {/* Float 1: Student card */}
            <div className="glass animate-float-slow absolute -start-4 -top-8 w-[220px] rounded-2xl p-4 md:-start-12">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#4fd1c5,#b794f4)" }}>
                  {lang === "ar" ? "أ م" : "AM"}
                </span>
                <div>
                  <p className="text-[0.65rem] text-slate-400">{t.hero.profileTitle}</p>
                  <p className="text-[0.82rem] font-semibold text-white">
                    {lang === "ar" ? "أحمد محمد الشريف" : "Ahmed M. Elsherif"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-white/8 pt-3">
                <span className="text-[0.65rem] text-slate-400">{t.hero.gpaLabel}</span>
                <span className="font-display text-xl font-bold tnum" style={{
                  background: "linear-gradient(135deg,#4fd1c5,#b794f4)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
                }} dir="ltr">3.86</span>
              </div>
              <div className="progress-track mt-2"><div className="progress-fill" style={{ width: "86%" }} /></div>
            </div>

            {/* Float 2: Live sync */}
            <div className="glass animate-float-slower absolute -bottom-7 end-0 w-[230px] rounded-2xl p-4 md:-end-10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-teal-400" />
                </span>
                <p className="text-[0.8rem] font-semibold text-white">{t.hero.syncOk}</p>
              </div>
              <p className="mt-1.5 text-[0.65rem] text-slate-500">{t.hero.syncDesc}</p>
              <div className="mt-3 flex items-end gap-1">
                {[35, 55, 40, 75, 50, 90, 65, 80].map((h, i) => (
                  <span key={i} className="flex-1 rounded-sm" style={{
                    height: `${h * 0.3}px`,
                    background: `linear-gradient(to top, rgba(79,209,197,0.4), rgba(159,122,234,0.8))`
                  }} />
                ))}
              </div>
            </div>

            {/* Float 3: Grade chip */}
            <div className="glass animate-float-slow absolute -top-4 end-8 flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ animationDelay: "-4s" }}>
              <CheckCircle2 size={17} className="text-teal-300" />
              <div>
                <p className="text-[0.6rem] text-slate-400">{t.hero.gradeChip}</p>
                <p className="font-display text-base font-bold text-white tnum" dir="ltr">A+ · 97%</p>
              </div>
            </div>

            {/* Float 4: Live indicator */}
            <div className="glass absolute start-4 bottom-20 flex items-center gap-2 rounded-xl px-3 py-2 md:start-8">
              <Zap size={14} className="text-violet-300" />
              <span className="text-[0.7rem] font-semibold text-white" dir="ltr">Live Sync</span>
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-400" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
