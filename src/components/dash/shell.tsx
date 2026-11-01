"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { AFLogo, UniMark } from "@/components/brand";
import { logoutAction } from "@/lib/actions/auth";
import { cn, initials } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

export function DashShell({
  nav,
  university,
  userName,
  userMeta,
  roleLabel,
  isPlatformAdmin = false,
  children,
}: {
  nav: NavItem[];
  university?: { name: string; nameEn?: string | null; logoColor?: string | null; code?: string } | null;
  userName: string;
  userMeta: string;
  roleLabel: string;
  isPlatformAdmin?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6">
        <Link href="/" className="block">
          <AFLogo size="sm" />
        </Link>
      </div>

      {university && (
        <div className="mx-4 mb-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
          <UniMark name={university.nameEn ?? university.name} color={university.logoColor ?? null} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[0.82rem] font-semibold text-white">{university.name}</p>
            <p className="truncate text-[0.68rem] text-mist-500" dir="ltr">{university.code}</p>
          </div>
        </div>
      )}

      {isPlatformAdmin && (
        <div className="mx-4 mb-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-400/[0.05] p-3.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-red-400/15 font-display text-[0.72rem] font-bold text-red-400 overflow-hidden">
            HQ
            <span className="absolute inset-0 bg-red-400/10 animate-pulse" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.82rem] font-bold text-white tracking-tight">مركز التحكم الرئيسي</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
              <p className="truncate text-[0.62rem] font-bold text-red-400 uppercase tracking-widest" dir="ltr">Operator Mode</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn("side-link", isActive(item) && "active")}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-600 to-ink-800 font-display text-xs font-bold text-gold-300">
            {initials(userName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.82rem] font-semibold text-white">{userName}</p>
            <p className="truncate text-[0.68rem] text-mist-500">{userMeta}</p>
          </div>
          <form action={logoutAction}>
            <button
              title="تسجيل الخروج"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 text-mist-400 transition-colors hover:border-rose-400/40 hover:text-rose-300"
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
        <p className="mt-3 text-center text-[0.62rem] tracking-wide text-mist-600">{roleLabel}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[268px] backdrop-blur-2xl lg:block"
        style={{ background: "rgba(7,11,26,0.95)", borderInlineEnd: "1px solid rgba(79,209,197,0.08)" }}>
        {sidebar}
      </aside>

      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 backdrop-blur-2xl lg:hidden"
        style={{ background: "rgba(4,5,15,0.92)", borderBottom: "1px solid rgba(79,209,197,0.08)" }}>
        <AFLogo size="sm" />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
          aria-label="القائمة"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-[280px]"
            style={{ background: "#070b1a", borderInlineEnd: "1px solid rgba(79,209,197,0.1)" }}>
            <button
              onClick={() => setOpen(false)}
              className="absolute end-3 top-5 grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-mist-300"
              aria-label="إغلاق"
            >
              <X size={16} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:ms-[268px]">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.55rem] font-bold text-white md:text-[1.8rem]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[0.86rem] text-mist-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
