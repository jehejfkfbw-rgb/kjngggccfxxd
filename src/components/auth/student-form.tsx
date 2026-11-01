"use client";

import { useActionState, useState } from "react";
import { Hash, KeyRound, Landmark, Mail } from "lucide-react";
import { googleSsoAction, studentLoginAction, type AuthState } from "@/lib/actions/auth";
import { ErrorBanner, GoogleG, SubmitButton } from "./shell";

export type LoginUniversity = {
  code: string;
  name: string;
  ssoType: "password" | "google";
  googleDomain: string | null;
};

export function StudentLoginForm({ universities }: { universities: LoginUniversity[] }) {
  const [code, setCode] = useState(universities[0]?.code ?? "");
  const selected = universities.find((u) => u.code === code);
  const hasGoogle = selected?.ssoType === "google";

  const [tab, setTab] = useState<"password" | "google">("password");
  const activeTab = tab === "google" && hasGoogle ? "google" : "password";

  const [pwState, pwAction, pwPending] = useActionState<AuthState, FormData>(studentLoginAction, null);
  const [gState, gAction, gPending] = useActionState<AuthState, FormData>(googleSsoAction, null);

  return (
    <div>
      {/* University selector */}
      <label className="label">الجامعة</label>
      <div className="has-icon relative">
        <Landmark size={16} className="field-icon" />
        <select className="input appearance-none" value={code} onChange={(e) => setCode(e.target.value)}>
          {universities.map((u) => (
            <option key={u.code} value={u.code}>
              {u.name} ({u.code})
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-1.5">
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-semibold transition-all duration-300 ${
            activeTab === "password" ? "bg-gold-400/15 text-gold-300" : "text-mist-400 hover:text-white"
          }`}
        >
          <KeyRound size={14} />
          الرقم الجامعي
        </button>
        <button
          type="button"
          onClick={() => hasGoogle && setTab("google")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-semibold transition-all duration-300 ${
            activeTab === "google" ? "bg-gold-400/15 text-gold-300" : hasGoogle ? "text-mist-400 hover:text-white" : "cursor-not-allowed text-mist-600"
          }`}
          title={hasGoogle ? undefined : "هذه الجامعة لا تستخدم Google Workspace"}
        >
          <GoogleG size={14} />
          الدخول الموحد
        </button>
      </div>

      {activeTab === "password" ? (
        <form action={pwAction} className="mt-6 space-y-4">
          <input type="hidden" name="universityCode" value={code} />
          <ErrorBanner message={pwState?.error} />
          <div>
            <label className="label">الرقم الجامعي</label>
            <div className="has-icon relative">
              <Hash size={16} className="field-icon" />
              <input name="studentNumber" required dir="ltr" placeholder="20210001" className="input text-end" />
            </div>
          </div>
          <div>
            <label className="label">كلمة المرور</label>
            <div className="has-icon relative">
              <KeyRound size={16} className="field-icon" />
              <input name="password" type="password" required placeholder="••••••••" className="input" />
            </div>
          </div>
          <SubmitButton pending={pwPending} label="تسجيل الدخول" pendingLabel="جارٍ التحقق من البيانات..." />
          <p className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-[0.74rem] leading-6 text-mist-400">
            الحسابات الجامعية المعتمدة تُنشأ وتُدار من جامعتك فقط. إذا لم تصلك بيانات الدخول، راجع شؤون الطلاب.
          </p>
        </form>
      ) : (
        <form action={gAction} className="mt-6 space-y-4">
          <input type="hidden" name="universityCode" value={code} />
          <ErrorBanner message={gState?.error} />
          <div>
            <label className="label">البريد الجامعي ({selected?.googleDomain})</label>
            <div className="has-icon relative">
              <Mail size={16} className="field-icon" />
              <input
                name="email"
                type="email"
                required
                dir="ltr"
                placeholder={`student@${selected?.googleDomain ?? "university.edu"}`}
                className="input text-end"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={gPending}
            className="btn w-full !border-white/15 !bg-white !py-3.5 !text-[0.92rem] !text-slate-800 hover:!bg-slate-100 disabled:opacity-60"
          >
            <GoogleG size={18} />
            {gPending ? "جارٍ التحقق عبر Google..." : "المتابعة باستخدام Google"}
          </button>
          <p className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-[0.74rem] leading-6 text-mist-400">
            الدخول الموحد متاح فقط بالبريد الجامعي المسجل رسمياً لدى {selected?.name}، عبر نطاق Google Workspace المعتمد.
          </p>
        </form>
      )}
    </div>
  );
}
