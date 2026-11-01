"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownLeft, CheckCircle2, GraduationCap, Landmark, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden pb-16 pt-[130px] md:pb-24 md:pt-[170px]">
      {/* Background layers */}
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -top-40 start-[8%] h-[480px] w-[480px] rounded-full bg-gold-500/[0.13] blur-[130px] animate-drift" />
      <div className="absolute top-24 end-[-6%] h-[420px] w-[420px] rounded-full bg-azure-500/[0.12] blur-[120px] animate-drift" style={{ animationDelay: "-6s" }} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="chip chip-gold !py-1.5 !text-[0.78rem]">
              <Sparkles size={13} />
              {t.hero.badge}
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6.2vw,4.6rem)] font-bold leading-[1.08] tracking-tight text-white">
              {t.hero.titleA}
              <br />
              <span className="gold-text animate-shine bg-[linear-gradient(110deg,#f9e7b8,#e9c66f_30%,#b8892e_55%,#f5d98a_80%,#f9e7b8)]">
                {t.hero.titleB}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-mist-300">{t.hero.sub}</p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link href="/login/student" className="btn btn-gold !px-7 !py-3.5 !text-[0.95rem]">
                <GraduationCap size={18} />
                {t.hero.ctaStudent}
                <ArrowDownLeft size={16} className="rtl:rotate-0 ltr:rotate-180" />
              </Link>
              <Link href="/join" className="btn btn-ghost !px-7 !py-3.5 !text-[0.95rem]">
                <Landmark size={17} />
                {t.hero.ctaJoin}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
              {[
                { v: universitiesCount, l: t.hero.uniWord },
                { v: studentsCount, l: t.hero.studentWord },
                { v: syncsCount, l: t.hero.liveOps },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-bold text-white">
                    <Counter to={s.v} />
                  </p>
                  <p className="mt-1 text-[0.78rem] text-mist-400">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[540px]">
            <div className="ring-gold relative overflow-hidden rounded-[1.8rem] shadow-[0_50px_120px_-40px_rgba(2,6,18,0.95)]">
              <Image
                src="/images/hero-campus.jpg"
                alt="Academic Future campus"
                width={1080}
                height={760}
                priority
                className="h-[380px] w-full object-cover md:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
              <div className="absolute bottom-5 start-5 end-5 flex items-end justify-between">
                <div>
                  <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-gold-300" dir="ltr">
                    ACADEMIC FUTURE
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-white">
                    {lang === "ar" ? "جامعات أكثر. تعقيد أقل." : "More universities. Less complexity."}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating: student card */}
            <div className="glass animate-float-slow absolute -start-4 -top-8 w-[230px] rounded-2xl p-4 md:-start-14">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-azure-400 to-azure-600 font-display text-xs font-bold text-white">
                  {lang === "ar" ? "أ م" : "AM"}
                </span>
                <div>
                  <p className="text-[0.68rem] text-mist-400">{t.hero.profileTitle}</p>
                  <p className="text-[0.82rem] font-semibold text-white">
                    {lang === "ar" ? "أحمد محمد الشريف" : "Ahmed Mohamed Elsherif"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
                <span className="text-[0.68rem] text-mist-400">{t.hero.gpaLabel}</span>
                <span className="font-display text-xl font-bold text-gold-300 tnum" dir="ltr">3.86</span>
              </div>
              <div className="progress-track mt-2"><div className="progress-fill" style={{ width: "86%" }} /></div>
            </div>

            {/* Floating: sync status */}
            <div className="glass animate-float-slower absolute -bottom-7 end-0 w-[240px] rounded-2xl p-4 md:-end-8">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[0.8rem] font-semibold text-white">{t.hero.syncOk}</p>
              </div>
              <p className="mt-1.5 text-[0.68rem] text-mist-400">{t.hero.syncDesc}</p>
              <div className="mt-2.5 flex gap-1">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-gold-600/50 to-gold-300" style={{ height: `${h * 0.32}px` }} />
                ))}
              </div>
            </div>

            {/* Floating: grade */}
            <div className="glass animate-float-slow absolute -top-5 end-6 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ animationDelay: "-3s" }}>
              <CheckCircle2 size={18} className="text-emerald-300" />
              <div>
                <p className="text-[0.62rem] text-mist-400">{t.hero.gradeChip}</p>
                <p className="font-display text-base font-bold text-white tnum" dir="ltr">A+ · 96%</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
