"use client";

import {
  ArrowUpDown,
  BookOpenCheck,
  Code2,
  FileSpreadsheet,
  KeyRound,
  Languages,
  LockKeyhole,
  MonitorCheck,
  Radar,
  ShieldCheck,
  GraduationCap,
  Users,
  Zap,
  BookMarked,
  CheckCircle2,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Counter, Reveal } from "@/components/motion";

export type HomeUniversity = {
  id: string;
  name: string;
  nameEn: string | null;
  city: string | null;
  country: string | null;
  code: string;
  logoColor: string | null;
  studentsCount: number | null;
};

const serviceIcons = [BookMarked, BookOpenCheck, MonitorCheck, KeyRound, FileSpreadsheet, Code2];

/* --------------------------- Universities marquee --------------------------- */

export function UniversitiesMarquee({ universities }: { universities: HomeUniversity[] }) {
  const { t, lang } = useLang();
  const list = [...universities, ...universities];

  return (
    <section id="universities" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <span className="eyebrow">{t.nav.universities}</span>
        </Reveal>
      </div>
      <Reveal delay={120} className="mt-8">
        <div className="marquee-mask overflow-hidden" dir="ltr">
          <div className="animate-marquee flex w-max gap-4 ps-4">
          {list.map((u, i) => (
            <div
              key={`${u.id}-${i}`}
              className="glass flex min-w-[300px] items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-300 hover:border-gold-500/40"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
                style={{ background: `linear-gradient(140deg, ${u.logoColor ?? "#d9ac45"}, ${u.logoColor ?? "#d9ac45"}44)` }}
              >
                {u.nameEn?.split(" ").map((w) => w[0]).slice(0, 2).join("") ?? u.code.slice(0, 2)}
              </span>
              <div className={lang === "ar" ? "text-right" : ""}>
                <p className="text-[0.9rem] font-semibold text-white">{lang === "ar" ? u.name : u.nameEn ?? u.name}</p>
                <p className="mt-0.5 text-[0.72rem] text-mist-400">
                  {[u.city, u.country].filter(Boolean).join(" · ")}
                  {u.studentsCount ? (
                    <span className="tnum" dir="ltr"> · {(u.studentsCount / 1000).toFixed(0)}K+</span>
                  ) : null}
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------- About ----------------------------------- */

export function About() {
  const { t } = useLang();
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-[1.25] text-white">
            {t.about.title}
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-mist-300">{t.about.body}</p>
        </Reveal>
        <div className="grid gap-3.5">
          {t.about.goals.map((goal, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="card-surface card-hover flex items-center gap-4 !rounded-2xl p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                  <CheckCircle2 size={20} />
                </span>
                <p className="text-[0.92rem] font-medium leading-7 text-mist-200">{goal}</p>
                <span className="ms-auto font-display text-xl font-bold text-white/10 tnum" dir="ltr">
                  0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Stats ----------------------------------- */

export function StatsBand({
  universities,
  students,
  courses,
  syncs,
}: {
  universities: number;
  students: number;
  courses: number;
  syncs: number;
}) {
  const { t } = useLang();
  const items = [
    { icon: Radar, v: universities, l: t.stats.universities },
    { icon: Users, v: students, l: t.stats.students },
    { icon: BookOpenCheck, v: courses, l: t.stats.courses },
    { icon: ArrowUpDown, v: syncs, l: t.stats.syncs },
  ];
  return (
    <section className="relative py-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="ring-gold grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/5 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.l} className="flex flex-col items-center gap-2 bg-ink-900/80 px-4 py-9 text-center">
                <it.icon size={20} className="mb-1 text-gold-400" />
                <p className="font-display text-[2rem] font-bold leading-none text-white md:text-[2.5rem]">
                  <Counter to={it.v} />
                </p>
                <p className="text-[0.78rem] text-mist-400">{it.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- Services --------------------------------- */

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="relative py-16 md:py-24">
      <div className="dots-bg absolute inset-x-0 top-0 h-64 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold text-white">{t.services.title}</h2>
          <p className="mt-4 leading-8 text-mist-400">{t.services.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal key={i} delay={(i % 3) * 110}>
                <div className="card-surface card-hover group h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-400/20 to-azure-500/10 text-gold-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-[1.05rem] font-semibold text-white">{s.t}</h3>
                  <p className="mt-2.5 text-[0.86rem] leading-7 text-mist-400">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Features --------------------------------- */

export function Features() {
  const { t } = useLang();
  return (
    <section id="features" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.features.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold text-white">{t.features.title}</h2>
          <p className="mt-4 leading-8 text-mist-400">{t.features.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {/* Big security card */}
          <Reveal className="lg:row-span-2">
            <div className="card-surface card-hover relative h-full overflow-hidden p-7">
              <div className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-gold-500/15 blur-3xl" />
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 shadow-[0_14px_34px_-10px_rgba(217,172,69,0.65)]">
                <ShieldCheck size={26} />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-white">{t.features.securityT}</h3>
              <p className="mt-3 text-[0.88rem] leading-7 text-mist-400">{t.features.securityD}</p>
              <ul className="mt-6 space-y-3">
                {t.features.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[0.85rem] text-mist-200">
                    <LockKeyhole size={15} className="shrink-0 text-gold-400" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[0.78rem] font-medium text-emerald-200" dir="ltr">
                  AES-256 · TLS 1.3 · ISO 27001 ready
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card-surface card-hover h-full p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-azure-400/10 text-azure-300">
                <GraduationCap size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{t.features.isolationT}</h3>
              <p className="mt-2.5 text-[0.86rem] leading-7 text-mist-400">{t.features.isolationD}</p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="card-surface card-hover h-full p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                <Languages size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{t.features.langT}</h3>
              <p className="mt-2.5 text-[0.86rem] leading-7 text-mist-400">{t.features.langD}</p>
            </div>
          </Reveal>

          <Reveal delay={300} className="lg:col-span-2">
            <div className="card-surface card-hover flex h-full flex-col justify-between gap-6 p-7 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Zap size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{t.features.liveT}</h3>
                  <p className="mt-2 text-[0.86rem] leading-7 text-mist-400">{t.features.liveD}</p>
                </div>
              </div>
              <div className="flex items-center gap-2" dir="ltr">
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[0.7rem] text-azure-300">POST /api/v1/students</span>
                <span className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 font-mono text-[0.7rem] text-emerald-300">200 OK</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
