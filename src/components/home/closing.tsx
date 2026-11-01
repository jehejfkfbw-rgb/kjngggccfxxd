"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Clock3, FileCheck2, GraduationCap,
  Landmark, Mail, Phone, PlugZap, ShieldCheck, Timer, Workflow,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { AFLogo, NovaMark } from "@/components/brand";
import { Reveal } from "@/components/motion";

const stepIcons = [FileCheck2, ShieldCheck, PlugZap];
const stepColors = ["rgba(79,209,197,0.15)","rgba(159,122,234,0.15)","rgba(245,101,101,0.15)"];
const stepTextColors = ["#4fd1c5","#b794f4","#fc8181"];

/* ────────── How it works ────────── */
export function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(79,209,197,0.35), transparent)" }} />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.how.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white">{t.how.title}</h2>
          <p className="mt-4 leading-8 text-slate-400">{t.how.sub}</p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="absolute start-[16%] end-[16%] top-8 hidden border-t border-dashed border-teal-500/20 md:block" />
          {t.how.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={i} delay={i * 130} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border"
                    style={{ background: stepColors[i], borderColor: `${stepTextColors[i]}40`, color: stepTextColors[i], boxShadow: `0 0 40px -12px ${stepTextColors[i]}60` }}>
                    <Icon size={24} />
                    <span className="absolute -top-2.5 -end-2.5 grid h-7 w-7 place-items-center rounded-full font-display text-[0.72rem] font-bold"
                      style={{ background: stepTextColors[i], color: "#04050f" }}>
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-white">{s.t}</h3>
                  <p className="mt-2.5 max-w-xs text-[0.84rem] leading-7 text-slate-400">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={400} className="mt-10 flex justify-center">
          <span className="chip chip-teal">
            <Timer size={13} />{t.how.note}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────── Portals ────────── */
export function Portals() {
  const { t } = useLang();
  return (
    <section id="portals" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t.portals.eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white">{t.portals.title}</h2>
          <p className="mt-4 leading-8 text-slate-400">{t.portals.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Students */}
          <Reveal>
            <div className="group relative h-full overflow-hidden rounded-[1.8rem] border border-white/6">
              <Image src="/images/hero-campus.jpg" alt="" width={900} height={600}
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,5,15,0.5), rgba(4,5,15,0.9))" }} />
              <div className="relative flex h-full flex-col p-8 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg,#4fd1c5,#38b2ac)", boxShadow: "0 16px 40px -12px rgba(79,209,197,0.8)" }}>
                  <GraduationCap size={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{t.portals.studentT}</h3>
                <p className="mt-3 max-w-md leading-8 text-slate-300">{t.portals.studentD}</p>
                <div className="mt-auto pt-8">
                  <Link href="/login/student" className="btn btn-primary w-full !py-3.5 sm:w-auto sm:!px-8">
                    {t.portals.studentCta}<ArrowLeft size={16} className="rtl:rotate-180" />
                  </Link>
                  <p className="mt-4 flex items-center gap-2 text-[0.72rem] text-slate-500">
                    <ShieldCheck size={12} className="text-teal-400" />{t.portals.studentNote}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Universities */}
          <Reveal delay={130}>
            <div className="group relative h-full overflow-hidden rounded-[1.8rem] border border-white/6">
              <Image src="/images/join-arch.jpg" alt="" width={900} height={600}
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,5,15,0.5), rgba(4,5,15,0.9))" }} />
              <div className="relative flex h-full flex-col p-8 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg,#b794f4,#805ad5)", boxShadow: "0 16px 40px -12px rgba(159,122,234,0.8)" }}>
                  <Landmark size={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{t.portals.uniT}</h3>
                <p className="mt-3 max-w-md leading-8 text-slate-300">{t.portals.uniD}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Link href="/login/university" className="btn btn-violet !py-3.5">{t.portals.uniCta}</Link>
                  <Link href="/join" className="btn btn-ghost !py-3.5">
                    <Workflow size={16} />{t.portals.uniCta2}
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

/* ────────── Contact ────────── */
export function Contact() {
  const { t } = useLang();
  const cards = [
    { icon: Mail, l: t.contact.emailL, v: t.contact.supportEmail, ltr: true },
    { icon: Phone, l: t.contact.phoneL, v: t.contact.phone, ltr: true },
    { icon: Clock3, l: t.contact.hoursL, v: t.contact.hoursV, ltr: false },
    { icon: Landmark, l: t.contact.partnerL, v: t.contact.partnerV, ltr: true },
  ];
  const cardColors = ["#4fd1c5","#b794f4","#fc8181","#4fd1c5"];

  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="ring-teal relative overflow-hidden rounded-[2rem] p-8 md:p-14"
            style={{ background: "linear-gradient(160deg, #0d1530, #090e1e)" }}>
            <div className="absolute -start-24 -top-24 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(79,209,197,0.1) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-24 -end-16 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(159,122,234,0.1) 0%, transparent 70%)" }} />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <span className="eyebrow">{t.contact.eyebrow}</span>
                <h2 className="mt-4 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-[1.3] text-white">{t.contact.title}</h2>
                <p className="mt-4 leading-8 text-slate-400">{t.contact.sub}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((c, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="glass rounded-2xl p-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl"
                        style={{ background: `${cardColors[i]}15`, color: cardColors[i] }}>
                        <c.icon size={18} />
                      </span>
                      <p className="mt-3.5 text-[0.7rem] font-semibold text-slate-500">{c.l}</p>
                      <p className="mt-1 text-[0.88rem] font-semibold text-white"
                        dir={c.ltr ? "ltr" : undefined} style={c.ltr ? { textAlign: "end" } : undefined}>
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

/* ────────── Footer ────────── */
export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t pt-14 pb-10" style={{ borderColor: "rgba(79,209,197,0.08)" }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <AFLogo />
            <p className="mt-5 max-w-sm text-[0.84rem] leading-7 text-slate-500">{t.footer.desc}</p>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold tracking-widest text-teal-600 uppercase">{t.footer.portalsL}</p>
            <ul className="mt-4 space-y-2.5 text-[0.84rem] text-slate-500">
              <li><Link className="hover:text-teal-300 transition-colors" href="/login/student">{t.nav.studentLogin}</Link></li>
              <li><Link className="hover:text-teal-300 transition-colors" href="/login/university">{t.nav.uniLogin}</Link></li>
              <li><Link className="hover:text-teal-300 transition-colors" href="/join">{t.nav.joinNow}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold tracking-widest text-teal-600 uppercase">{t.footer.contactL}</p>
            <ul className="mt-4 space-y-2.5 text-[0.84rem] text-slate-500">
              <li dir="ltr" className="text-end">{t.contact.supportEmail}</li>
              <li dir="ltr" className="text-end">{t.contact.phone}</li>
              <li>{t.contact.hoursV}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t pt-7 sm:flex-row"
          style={{ borderColor: "rgba(79,209,197,0.07)" }}>
          <div className="flex items-center gap-5">
            <p className="text-[0.76rem] text-slate-600">{t.footer.rights}</p>
            <Link href="/secure-admin/login"
              className="text-[0.68rem] text-slate-700 hover:text-teal-500 transition-colors">
              {t.footer.adminLink}
            </Link>
          </div>
          <a href="https://novadigital.io" target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-full border border-white/8 bg-white/[0.03] py-2 pe-5 ps-2 transition-all hover:border-teal-500/40">
            <NovaMark />
            <span className="font-display text-[0.78rem] font-semibold tracking-wide text-slate-400 group-hover:text-white transition-colors" dir="ltr">
              {t.footer.developed}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
