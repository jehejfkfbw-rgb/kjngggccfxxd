"use client";

import { useActionState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { changePasswordAction, type PasswordState } from "@/lib/actions/student";
import { ErrorBanner, SubmitButton, SuccessBanner } from "@/components/auth/shell";

export function ChangePasswordCard() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePasswordAction, null);

  return (
    <div className="card-surface p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <ShieldCheck size={22} />
        </span>
        <div>
          <h3 className="font-display text-[1.05rem] font-semibold text-white">أمان الحساب</h3>
          <p className="mt-1.5 text-[0.82rem] leading-7 text-mist-400">
            يمكنك تغيير كلمة المرور الخاصة بك في أي وقت. بياناتك الأكاديمية الأخرى يتم تحديثها من جامعتك فقط.
          </p>
        </div>
      </div>
      <form action={action} className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <ErrorBanner message={state?.error} />
          <SuccessBanner message={state?.success} />
        </div>
        <div>
          <label className="label">كلمة المرور الحالية</label>
          <div className="has-icon relative">
            <KeyRound size={15} className="field-icon" />
            <input name="current" type="password" required className="input" placeholder="••••••••" />
          </div>
        </div>
        <div>
          <label className="label">كلمة المرور الجديدة</label>
          <div className="has-icon relative">
            <KeyRound size={15} className="field-icon" />
            <input name="next" type="password" required className="input" placeholder="8 أحرف على الأقل" />
          </div>
        </div>
        <div>
          <label className="label">تأكيد الجديدة</label>
          <div className="has-icon relative">
            <KeyRound size={15} className="field-icon" />
            <input name="confirm" type="password" required className="input" placeholder="••••••••" />
          </div>
        </div>
        <div className="sm:col-span-3 sm:w-56">
          <SubmitButton pending={pending} label="تحديث كلمة المرور" />
        </div>
      </form>
    </div>
  );
}
