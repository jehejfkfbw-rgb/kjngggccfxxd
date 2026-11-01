"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownLeft,
  Clock3,
  FileCheck2,
  GraduationCap,
  Landmark,
  Mail,
  Phone,
  PlugZap,
  ShieldCheck,
  Timer,
  Workflow,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { AFLogo, NovaMark } from "@/components/brand";
import { Reveal } from "@/components/motion";

const stepIcons = [FileCheck2, ShieldCheck, PlugZap];

/* -------------------------------- How it works ------------------------------ */

export function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute start-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-l from-transparent via-gold-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.how.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold text-white">{t.how.title}</h2>
          <p className="mt-4 leading-8 text-mist-400">{t.how.sub}</p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="absolute start-[16%] end-[16%] top-8 hidden border-t border-dashed border-gold-500/25 md:block" />
          {t.how.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={i} delay={i * 140} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-gold-500/30 bg-ink-900 text-gold-300 shadow-[0_0_40px_-10px_rgba(217,172,69,0.45)]">
                    <Icon size={24} />
                    <span className="absolute -top-2 -end-2 grid h-6 w-6 place-items-center rounded-full bg-gold-500 font-display text-[0.7rem] font-bold text-ink-950">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-white">{s.t}</h3>
                  <p className="mt-2.5 max-w-xs text-[0.86rem] leading-7 text-mist-400">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={420} className="mt-12 flex justify-center">
          <span className="chip chip-gold">
            <Timer size={13} />
            {t.how.note}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Portals ---------------------------------- */

export function Portals() {
  const { t } = useLang();
  return (
    <section id="portals" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.portals.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold text-white">{t.portals.title}</h2>
          <p className="mt-4 leading-8 text-mist-400">{t.portals.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Students */}
          <Reveal>
            <div className="group relative h-full overflow-hidden rounded-[1.6rem] border border-white/8">
              <Image
                src="/images/hero-campus.jpg"
                alt=""
                width={900}
                height={600}
                className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950" />
              <div className="relative flex h-full flex-col p-8 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-azure-400 to-azure-600 text-white shadow-[0_16px_36px_-12px_rgba(76,141,255,0.7)]">
                  <GraduationCap size={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{t.portals.studentT}</h3>
                <p className="mt-3 max-w-md leading-8 text-mist-300">{t.portals.studentD}</p>
                <div className="mt-auto pt-8">
                  <Link href="/login/student" className="btn btn-gold w-full !py-3.5 sm:w-auto sm:!px-8">
                    {t.portals.studentCta}
                    <ArrowDownLeft size={16} className="ltr:rotate-180" />
                  </Link>
                  <p className="mt-4 flex items-center gap-2 text-[0.75rem] text-mist-400">
                    <ShieldCheck size={13} className="text-emerald-300" />
                    {t.portals.studentNote}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Universities */}
          <Reveal delay={140}>
            <div className="group relative h-full overflow-hidden rounded-[1.6rem] border border-white/8">
              <Image
                src="/images/join-arch.jpg"
                alt=""
                width={900}
                height={600}
                className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950" />
              <div className="relative flex h-full flex-col p-8 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 shadow-[0_16px_36px_-12px_rgba(217,172,69,0.7)]">
                  <Landmark size={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{t.portals.uniT}</h3>
                <p className="mt-3 max-w-md leading-8 text-mist-300">{t.portals.uniD}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Link href="/login/university" className="btn btn-gold !py-3.5">
                    {t.portals.uniCta}
                  </Link>
                  <Link href="/join" className="btn btn-ghost !py-3.5">
                    <Workflow size={16} />
                    {t.portals.uniCta2}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Contact --------------------------------- */

export function Contact() {
  const { t } = useLang();
  const cards = [
    { icon: Mail, l: t.contact.emailL, v: t.contact.supportEmail, ltr: true },
    { icon: Phone, l: t.contact.phoneL, v: t.contact.phone, ltr: true },
    { icon: Clock3, l: t.contact.hoursL, v: t.contact.hoursV, ltr: false },
    { icon: Landmark, l: t.contact.partnerL, v: t.contact.partnerV, ltr: true },
  ];
  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="ring-gold relative overflow-hidden rounded-[2rem] bg-ink-900/70 p-8 md:p-14">
            <div className="absolute -start-24 -top-24 h-72 w-72 rounded-full bg-azure-500/10 blur-3xl" />
            <div className="absolute -bottom-28 -end-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <span className="eyebrow">{t.contact.eyebrow}</span>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-[1.3] text-white">
                  {t.contact.title}
                </h2>
                <p className="mt-4 leading-8 text-mist-400">{t.contact.sub}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((c, i) => (
                  <Reveal key={i} delay={i * 90}>
                    <div className="glass rounded-2xl p-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                        <c.icon size={18} />
                      </span>
                      <p className="mt-3.5 text-[0.72rem] text-mist-400">{c.l}</p>
                      <p
                        className="mt-1 text-[0.9rem] font-semibold text-white"
                        dir={c.ltr ? "ltr" : undefined}
                        style={c.ltr ? { textAlign: "end" } : undefined}
                      >
                        {c.v}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- Footer ---------------------------------- */

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/5 pb-10 pt-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <AFLogo />
            <p className="mt-5 max-w-sm text-[0.86rem] leading-7 text-mist-400">{t.footer.desc}</p>
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold tracking-wide text-mist-300">{t.footer.portalsL}</p>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] text-mist-400">
              <li><Link className="transition-colors hover:text-gold-300" href="/login/student">{t.nav.studentLogin}</Link></li>
              <li><Link className="transition-colors hover:text-gold-300" href="/login/university">{t.nav.uniLogin}</Link></li>
              <li><Link className="transition-colors hover:text-gold-300" href="/join">{t.nav.joinNow}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[0.75rem] font-semibold tracking-wide text-mist-300">{t.footer.contactL}</p>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] text-mist-400">
              <li dir="ltr" className="text-end">{t.contact.supportEmail}</li>
              <li dir="ltr" className="text-end">{t.contact.phone}</li>
              <li>{t.contact.hoursV}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-7 sm:flex-row">
          <p className="text-[0.78rem] text-mist-500">{t.footer.rights}</p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-2 pe-5 ps-2 transition-colors duration-300 hover:border-gold-500/40"
          >
            <NovaMark />
            <span className="font-display text-[0.8rem] font-semibold tracking-wide text-mist-200 group-hover:text-white" dir="ltr">
              {t.footer.developed}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
