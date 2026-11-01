"use client";

import {
  ArrowUpDown, BookOpenCheck, Code2, FileSpreadsheet,
  KeyRound, Languages, LockKeyhole, MonitorCheck,
  Radar, ShieldCheck, GraduationCap, Users, Zap, BookMarked,
  CheckCircle2, Globe2,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Counter, Reveal } from "@/components/motion";

export type HomeUniversity = {
  id: string; name: string; nameEn: string | null;
  city: string | null; country: string | null;
  code: string; logoColor: string | null; studentsCount: number | null;
};

const serviceIcons = [BookMarked, BookOpenCheck, MonitorCheck, KeyRound, FileSpreadsheet, Code2];
const serviceColors = [
  "rgba(79,209,197,0.12)", "rgba(159,122,234,0.12)", "rgba(245,101,101,0.12)",
  "rgba(79,209,197,0.12)", "rgba(159,122,234,0.12)", "rgba(245,101,101,0.12)",
];
const serviceTextColors = ["#81e6d9","#d6bcfa","#fc8181","#81e6d9","#d6bcfa","#fc8181"];

/* ────────── Universities Marquee ────────── */
export function UniversitiesMarquee({ universities }: { universities: HomeUniversity[] }) {
  const { t, lang } = useLang();
  const list = [...universities, ...universities];

  return (
    <section id="universities" className="relative py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <span className="eyebrow">{t.nav.universities}</span>
          <p className="mt-2 text-[0.84rem] text-slate-500">
            {lang === "ar" ? "جامعات موثوقة تثق بـ Academic Future" : "Trusted universities on Academic Future"}
          </p>
        </Reveal>
      </div>
      <Reveal delay={120} className="mt-10">
        <div className="marquee-mask overflow-hidden" dir="ltr">
          <div className="animate-marquee flex w-max gap-4 ps-4">
            {list.map((u, i) => (
              <div key={`${u.id}-${i}`}
                className="glass flex min-w-[300px] items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:border-teal-400/40">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
                  style={{ background: `linear-gradient(140deg,${u.logoColor ?? "#4fd1c5"},${u.logoColor ?? "#4fd1c5"}55)` }}>
                  {(u.nameEn ?? u.name).split(" ").map(w => w[0]).slice(0, 2).join("")}
                </span>
                <div>
                  <p className="text-[0.88rem] font-semibold text-white">
                    {lang === "ar" ? u.name : u.nameEn ?? u.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-slate-500">
                    <Globe2 size={10} />
                    {[u.city, u.country].filter(Boolean).join(" · ")}
                    {u.studentsCount ? <span className="tnum" dir="ltr">· {(u.studentsCount / 1000).toFixed(0)}K+</span> : null}
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

/* ────────── About ────────── */
export function About() {
  const { t } = useLang();
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.22] text-white">
            {t.about.title}
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">{t.about.body}</p>
        </Reveal>
        <div className="grid gap-3.5">
          {t.about.goals.map((goal, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="card-surface card-hover flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-teal-300"
                  style={{ background: "rgba(79,209,197,0.1)" }}>
                  <CheckCircle2 size={20} />
                </span>
                <p className="text-[0.9rem] font-medium leading-7 text-slate-300">{goal}</p>
                <span className="ms-auto font-display text-2xl font-bold text-white/8 tnum shrink-0" dir="ltr">0{i+1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Stats Band ────────── */
export function StatsBand({ universities, students, courses, syncs }: {
  universities: number; students: number; courses: number; syncs: number;
}) {
  const { t } = useLang();
  const items = [
    { icon: Radar, v: universities, l: t.stats.universities, color: "#4fd1c5" },
    { icon: Users, v: students, l: t.stats.students, color: "#b794f4" },
    { icon: BookOpenCheck, v: courses, l: t.stats.courses, color: "#fc8181" },
    { icon: ArrowUpDown, v: syncs, l: t.stats.syncs, color: "#4fd1c5" },
  ];
  return (
    <section className="relative py-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="ring-teal grid grid-cols-2 gap-px overflow-hidden rounded-3xl" style={{ background: "rgba(79,209,197,0.08)" }}>
            {items.map(it => (
              <div key={it.l} className="flex flex-col items-center gap-3 p-8 text-center" style={{ background: "#070b1a" }}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${it.color}18` }}>
                  <it.icon size={22} style={{ color: it.color }} />
                </span>
                <p className="font-display text-[2.2rem] font-bold leading-none text-white md:text-[2.6rem]">
                  <Counter to={it.v} />
                </p>
                <p className="text-[0.76rem] text-slate-500">{it.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────── Services ────────── */
export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="relative py-16 md:py-24">
      <div className="dots-bg absolute inset-x-0 top-0 h-80 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white">{t.services.title}</h2>
          <p className="mt-4 leading-8 text-slate-400">{t.services.sub}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal key={i} delay={(i % 3) * 100}>
                <div className="card-surface card-hover group h-full p-6">
                  <span className="grid h-13 w-13 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: serviceColors[i], color: serviceTextColors[i] }}>
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 font-display text-[1.05rem] font-semibold text-white">{s.t}</h3>
                  <p className="mt-2.5 text-[0.84rem] leading-7 text-slate-500">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────── Features Bento ────────── */
export function Features() {
  const { t } = useLang();
  return (
    <section id="features" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.features.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white">{t.features.title}</h2>
          <p className="mt-4 leading-8 text-slate-400">{t.features.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {/* Big: security */}
          <Reveal className="lg:row-span-2">
            <div className="card-surface card-hover relative h-full overflow-hidden p-7">
              <div className="absolute -end-20 -top-20 h-52 w-52 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(79,209,197,0.14) 0%, transparent 70%)" }} />
              <span className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg,#4fd1c5,#38b2ac)", boxShadow: "0 14px 36px -10px rgba(79,209,197,0.7)" }}>
                <ShieldCheck size={26} />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-white">{t.features.securityT}</h3>
              <p className="mt-3 text-[0.86rem] leading-7 text-slate-400">{t.features.securityD}</p>
              <ul className="mt-6 space-y-3">
                {t.features.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-[0.83rem] text-slate-300">
                    <LockKeyhole size={14} className="shrink-0 text-teal-400" />{b}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-teal-400/20 bg-teal-400/[0.06] p-4">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-teal-400" />
                </span>
                <p className="text-[0.72rem] font-semibold text-teal-200" dir="ltr">Scrypt · TLS 1.3 · HttpOnly Sessions</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card-surface card-hover h-full p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "rgba(159,122,234,0.12)", color: "#d6bcfa" }}>
                <GraduationCap size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{t.features.isolationT}</h3>
              <p className="mt-2.5 text-[0.84rem] leading-7 text-slate-400">{t.features.isolationD}</p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="card-surface card-hover h-full p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "rgba(245,101,101,0.1)", color: "#fc8181" }}>
                <Languages size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{t.features.langT}</h3>
              <p className="mt-2.5 text-[0.84rem] leading-7 text-slate-400">{t.features.langD}</p>
            </div>
          </Reveal>

          <Reveal delay={260} className="lg:col-span-2">
            <div className="card-surface card-hover flex h-full flex-col justify-between gap-6 p-7 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: "rgba(79,209,197,0.1)", color: "#81e6d9" }}>
                  <Zap size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{t.features.liveT}</h3>
                  <p className="mt-2 text-[0.84rem] leading-7 text-slate-400">{t.features.liveD}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0" dir="ltr">
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[0.68rem] text-sky-300">POST /api/v1/students</span>
                <span className="rounded-lg border border-teal-400/25 bg-teal-400/10 px-3 py-2 font-mono text-[0.68rem] text-teal-300">200 OK</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
