"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";
import { AFLogo } from "@/components/brand";
import { submitJoinRequestAction, type JoinState } from "@/lib/actions/join";
import { ErrorBanner, GoogleG, SubmitButton } from "@/components/auth/shell";

export default function JoinPage() {
  const [state, action, pending] = useActionState<JoinState, FormData>(submitJoinRequestAction, null);
  const [docs, setDocs] = useState<{ name: string; size: string }[]>([]);
  const [sso, setSso] = useState<"password" | "google">("password");
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = [...docs];
    for (const f of Array.from(files)) {
      next.push({ name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB` });
    }
    setDocs(next.slice(0, 8));
  };

  if (state?.success) {
    return (
      <div className="grid-bg grid min-h-screen place-items-center px-5 py-12">
        <div className="ring-gold card-surface w-full max-w-lg p-10 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={38} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">تم استلام طلب الانضمام</h1>
          <p className="mt-3 text-[0.9rem] leading-8 text-mist-400">
            شكراً لثقتكم. سيقوم فريق إدارة المنصة بمراجعة بيانات جامعتكم والمستندات المرفقة خلال 48 ساعة عمل،
            وسيتم إرسال بيانات حساب المسؤول إلى البريد الرسمي فور الاعتماد.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="btn btn-ghost">العودة للرئيسية</Link>
            <Link href="/login/university" className="btn btn-gold">دخول الجامعات</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -top-32 end-[6%] h-96 w-96 rounded-full bg-azure-500/10 blur-[120px]" />

      <header className="relative mx-auto flex h-[74px] max-w-6xl items-center justify-between px-5">
        <Link href="/"><AFLogo size="sm" /></Link>
        <Link href="/login/university" className="btn btn-ghost !px-4 !py-2 !text-xs">
          <ArrowRight size={14} />
          دخول الجامعات
        </Link>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-20 pt-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip chip-gold"><Landmark size={13} /> بوابة انضمام الجامعات</span>
          <h1 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-snug text-white">
            انضم بجامعتك إلى <span className="gold-text">Academic Future</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[0.9rem] leading-8 text-mist-400">
            قدّم بيانات جامعتك الرسمية والمستندات المطلوبة. بعد اعتماد إدارة المنصة سيتم إنشاء حساب المسؤول
            ومفاتيح الربط البرمجي الخاصة بجامعتكم.
          </p>
        </div>

        <form action={action} className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          <input type="hidden" name="ssoType" value={sso} />
          <input type="hidden" name="documents" value={JSON.stringify(docs)} />
          <div className="lg:col-span-2"><ErrorBanner message={state?.error} /></div>

          {/* University data */}
          <div className="card-surface p-6 md:p-8">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
              <Building2 size={19} className="text-gold-400" />
              بيانات الجامعة الرسمية
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="label">اسم الجامعة (عربي) *</label>
                <input name="universityName" required className="input" placeholder="جامعة المستقبل الأهلية" />
              </div>
              <div>
                <label className="label">اسم الجامعة (إنجليزي)</label>
                <input name="universityNameEn" dir="ltr" className="input text-end" placeholder="Future University" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">الدولة *</label>
                  <div className="has-icon relative">
                    <MapPin size={15} className="field-icon" />
                    <input name="country" required className="input" placeholder="المملكة العربية السعودية" />
                  </div>
                </div>
                <div>
                  <label className="label">المدينة</label>
                  <input name="city" className="input" placeholder="الرياض" />
                </div>
              </div>
              <div>
                <label className="label">الموقع الرسمي</label>
                <div className="has-icon relative">
                  <Globe2 size={15} className="field-icon" />
                  <input name="website" dir="ltr" className="input text-end" placeholder="https://university.edu" />
                </div>
              </div>
              <div>
                <label className="label">عدد الطلاب التقريبي</label>
                <div className="has-icon relative">
                  <Users size={15} className="field-icon" />
                  <input name="studentsCount" type="number" min={0} dir="ltr" className="input text-end" placeholder="25000" />
                </div>
              </div>
              <div>
                <label className="label">نظام الدخول المعتمد لدى الجامعة</label>
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-1.5">
                  <button
                    type="button"
                    onClick={() => setSso("password")}
                    className={`rounded-xl px-3 py-2.5 text-[0.8rem] font-semibold transition-all ${sso === "password" ? "bg-gold-400/15 text-gold-300" : "text-mist-400"}`}
                  >
                    رقم جامعي + كلمة مرور
                  </button>
                  <button
                    type="button"
                    onClick={() => setSso("google")}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-semibold transition-all ${sso === "google" ? "bg-gold-400/15 text-gold-300" : "text-mist-400"}`}
                  >
                    <GoogleG size={14} /> Google Workspace
                  </button>
                </div>
              </div>
              {sso === "google" && (
                <div>
                  <label className="label">نطاق Google Workspace المعتمد *</label>
                  <input name="googleDomain" dir="ltr" className="input text-end" placeholder="university.edu" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Contact */}
            <div className="card-surface p-6 md:p-8">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
                <User size={19} className="text-gold-400" />
                بيانات مسؤول الاتصال
              </h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="label">الاسم الكامل *</label>
                  <input name="contactName" required className="input" placeholder="د. محمد عبدالله" />
                </div>
                <div>
                  <label className="label">البريد الرسمي *</label>
                  <div className="has-icon relative">
                    <Mail size={15} className="field-icon" />
                    <input name="contactEmail" type="email" required dir="ltr" className="input text-end" placeholder="registrar@university.edu" />
                  </div>
                  <p className="mt-1.5 text-[0.7rem] text-mist-500">سيصبح هذا البريد حساب مسؤول الجامعة بعد الاعتماد.</p>
                </div>
                <div>
                  <label className="label">رقم الهاتف</label>
                  <div className="has-icon relative">
                    <Phone size={15} className="field-icon" />
                    <input name="contactPhone" dir="ltr" className="input text-end" placeholder="+966 5x xxx xxxx" />
                  </div>
                </div>
                <div>
                  <label className="label">ملاحظات إضافية</label>
                  <textarea name="message" rows={3} className="input resize-none" placeholder="أي تفاصيل تود إيضاحها لفريق المراجعة..." />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="card-surface p-6 md:p-8">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
                <FileText size={19} className="text-gold-400" />
                مستندات التحقق *
              </h2>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-5 flex w-full flex-col items-center gap-2.5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-center transition-colors hover:border-gold-500/50 hover:bg-gold-400/[0.04]"
              >
                <UploadCloud size={26} className="text-gold-400" />
                <span className="text-[0.85rem] font-medium text-mist-200">اسحب الملفات أو اضغط للاختيار</span>
                <span className="text-[0.7rem] text-mist-500">قرار الاعتماد، السجل الأكاديمي، خطاب رسمي موقّع — PDF / صور</span>
              </button>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              {docs.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {docs.map((d, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
                      <FileText size={15} className="shrink-0 text-azure-300" />
                      <span className="min-w-0 flex-1 truncate text-[0.8rem] text-mist-200" dir="ltr" style={{ textAlign: "start" }}>{d.name}</span>
                      <span className="text-[0.68rem] text-mist-500" dir="ltr">{d.size}</span>
                      <button type="button" onClick={() => setDocs(docs.filter((_, x) => x !== i))} className="text-mist-500 hover:text-rose-300">
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <SubmitButton pending={pending} label="إرسال طلب الانضمام للمراجعة" pendingLabel="جارٍ إرسال الطلب..." />
            <p className="mt-4 text-center text-[0.72rem] leading-6 text-mist-500">
              بإرسال الطلب أنت تقر بصحة البيانات المقدمة، وتوافق على شروط انضمام الجهات الأكاديمية للمنصة.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
