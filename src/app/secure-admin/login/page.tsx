"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Activity, Fingerprint, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { adminLoginAction, type AuthState } from "@/lib/actions/auth";
import { ErrorBanner, SubmitButton } from "@/components/auth/shell";
import { AFLogo } from "@/components/brand";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(adminLoginAction, null);

  return (
    <div className="grid-bg relative grid min-h-screen place-items-center px-5 py-10">
      <div className="absolute -top-28 start-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[110px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/"><AFLogo /></Link>
          <div className="mt-6 flex items-center gap-2 text-[0.72rem] font-semibold text-gold-400">
            <Fingerprint size={14} />
            <span dir="ltr">RESTRICTED · PLATFORM OPERATORS ONLY</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">لوحة تحكم إدارة المنصة</h1>
          <p className="mt-2 text-[0.84rem] leading-7 text-mist-400">
            هذه المنطقة محمية بمصادقة صارمة، وجميع المحاولات مسجلة ومراقبة.
          </p>
        </div>

        <div className="ring-gold card-surface p-7">
          <form action={action} className="space-y-4">
            <ErrorBanner message={state?.error} />
            <div>
              <label className="label">البريد الإلكتروني</label>
              <div className="has-icon relative">
                <Mail size={16} className="field-icon" />
                <input name="email" type="email" required dir="ltr" autoComplete="off" placeholder="operator@nova.digital" className="input text-end" />
              </div>
            </div>
            <div>
              <label className="label">كلمة المرور</label>
              <div className="has-icon relative">
                <KeyRound size={16} className="field-icon" />
                <input name="password" type="password" required placeholder="••••••••••" className="input" />
              </div>
            </div>
            <SubmitButton pending={pending} label="مصادقة ودخول" pendingLabel="جارٍ المصادقة..." />
          </form>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[0.72rem] text-mist-500">
          <ShieldCheck size={13} className="text-emerald-400" />
          جلسات الإدارة محدودة بثماني ساعات وتحديد صارم لمعدل المحاولات
          <Activity size={13} className="text-azure-400" />
        </div>
      </div>
    </div>
  );
}
