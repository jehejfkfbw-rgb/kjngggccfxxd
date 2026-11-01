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
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink-950/85 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/" aria-label="Academic Future">
          <AFLogo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.85rem] font-medium text-mist-300 transition-colors duration-300 hover:text-gold-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <LangToggle compact />
          <Link href="/login/university" className="btn btn-ghost !py-2.5">
            <Landmark size={15} />
            {t.nav.uniLogin}
          </Link>
          <Link href="/login/student" className="btn btn-gold !py-2.5">
            <GraduationCap size={16} />
            {t.nav.studentLogin}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LangToggle compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-ink-950/95 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-mist-200 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link href="/login/university" className="btn btn-ghost">
              {t.nav.uniLogin}
            </Link>
            <Link href="/login/student" className="btn btn-gold">
              {t.nav.studentLogin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
