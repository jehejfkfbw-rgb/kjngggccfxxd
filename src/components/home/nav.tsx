"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, Landmark, Menu, X } from "lucide-react";
import { AFLogo } from "@/components/brand";
import { LangToggle, useLang } from "@/lib/i18n";

export function SiteNav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#universities", label: t.nav.universities },
    { href: "#services", label: t.nav.services },
    { href: "#features", label: t.nav.features },
    { href: "#how", label: t.nav.how },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled
        ? "border-b border-teal-500/10 bg-space-950/90 shadow-[0_8px_32px_-16px_rgba(4,5,15,0.9)] backdrop-blur-2xl"
        : "bg-transparent"
    }`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/"><AFLogo /></Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="relative text-[0.84rem] font-medium text-slate-400 transition-colors duration-300 hover:text-teal-300
                after:absolute after:-bottom-0.5 after:start-0 after:h-px after:w-0 after:bg-teal-400 after:transition-all after:duration-300 hover:after:w-full">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <LangToggle compact />
          <Link href="/login/university" className="btn btn-ghost !py-2">
            <Landmark size={15} />{t.nav.uniLogin}
          </Link>
          <Link href="/login/student" className="btn btn-primary !py-2">
            <GraduationCap size={16} />{t.nav.studentLogin}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangToggle compact />
          <button onClick={() => setOpen(v => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-teal-500/20 bg-teal-400/5 text-white">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-teal-500/10 bg-space-950/95 px-5 pb-6 pt-3 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-teal-400/5 hover:text-teal-300">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link href="/login/university" className="btn btn-ghost">{t.nav.uniLogin}</Link>
            <Link href="/login/student" className="btn btn-primary">{t.nav.studentLogin}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
