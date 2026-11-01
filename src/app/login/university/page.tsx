"use client";

import Link from "next/link";
import { useActionState } from "react";
import { KeyRound, Mail, Workflow } from "lucide-react";
import { AuthShell, ErrorBanner, SubmitButton } from "@/components/auth/shell";
import { universityLoginAction, type AuthState } from "@/lib/actions/auth";

export default function UniversityLoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(universityLoginAction, null);

  return (
    <AuthShell
      title="بوابة الجامعات"
      subtitle="دخول مسؤولي الجامعات المعتمدين لإدارة بيانات الطلاب والكليات والمواد والمزامنة البرمجية."
      asideTitle="لوحة تحكم مستقلة ومؤمّنة لكل جامعة"
      asideSubtitle="كل جامعة تعمل في مساحة معزولة تماماً — بياناتك لا تطّلع عليها أي جهة أخرى، مع سجل مزامنة كامل لكل العمليات."
      asidePoints={[
        "إضافة وتحديث بيانات الطلاب يدوياً أو عبر Excel / CSV",
        "إدارة الكليات والأقسام والفرق والمواد الدراسية",
        "مفاتيح API خاصة وسجل مزامنة لحظي",
      ]}
      image="/images/join-arch.jpg"
    >
      <form action={action} className="space-y-4">
        <ErrorBanner message={state?.error} />
        <div>
          <label className="label">البريد الإلكتروني للمسؤول</label>
          <div className="has-icon relative">
            <Mail size={16} className="field-icon" />
            <input name="email" type="email" required dir="ltr" placeholder="admin@university.edu" className="input text-end" />
          </div>
        </div>
        <div>
          <label className="label">كلمة المرور</label>
          <div className="has-icon relative">
            <KeyRound size={16} className="field-icon" />
            <input name="password" type="password" required placeholder="••••••••" className="input" />
          </div>
        </div>
        <SubmitButton pending={pending} label="دخول لوحة التحكم" pendingLabel="جارٍ التحقق..." />
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
        <p className="text-[0.78rem] text-mist-400">جامعتك ليست مشاركة بعد؟</p>
        <Link href="/join" className="btn btn-ghost !px-4 !py-2 !text-xs">
          <Workflow size={13} />
          قدّم طلب انضمام
        </Link>
      </div>
    </AuthShell>
  );
}
