"use client";

import { useRef, useState, useTransition } from "react";
import { X, Settings2, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { University } from "@/db/schema";
import { updateUniversitySettingsAction } from "@/lib/actions/admin";

export function UniEditor({ uni }: { uni: University }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [sso, setSso] = useState(uni.ssoType);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button 
        onClick={() => dialogRef.current?.showModal()}
        className="btn btn-ghost !p-2 rounded-lg" 
        title="تعديل إعدادات الجامعة"
      >
        <Settings2 size={15} />
      </button>

      <dialog ref={dialogRef} className="modal-dialog">
        <div className="card-surface p-7 ring-teal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal-400" />
              تعديل إعدادات {uni.name}
            </h2>
            <button onClick={close} className="text-slate-500 hover:text-white"><X size={20} /></button>
          </div>

          <form action={(fd) => startTransition(async () => { await updateUniversitySettingsAction(fd); close(); })} className="space-y-4">
            <input type="hidden" name="id" value={uni.id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">الاسم (عربي)</label>
                <input name="name" defaultValue={uni.name} required className="input" />
              </div>
              <div>
                <label className="label">الاسم (إنجليزي)</label>
                <input name="nameEn" defaultValue={uni.nameEn ?? ""} className="input" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">لون الشعار (Hex)</label>
                <div className="flex items-center gap-2">
                   <input name="logoColor" defaultValue={uni.logoColor ?? "#4fd1c5"} className="input font-mono" dir="ltr" />
                   <div className="h-10 w-10 shrink-0 rounded-lg border border-white/10" style={{ backgroundColor: uni.logoColor ?? "#4fd1c5" }} />
                </div>
              </div>
              <div>
                <label className="label">نظام الدخول</label>
                <select 
                  name="ssoType" 
                  value={sso} 
                  onChange={(e) => setSso(e.target.value as any)}
                  className="input"
                >
                  <option value="password">كلمة مرور</option>
                  <option value="google">Google SSO</option>
                </select>
              </div>
            </div>

            {sso === "google" && (
              <div>
                <label className="label">نطاق Google المعتمد</label>
                <input name="googleDomain" defaultValue={uni.googleDomain ?? ""} className="input" dir="ltr" placeholder="university.edu" />
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={close} className="btn btn-ghost flex-1">إلغاء</button>
              <button disabled={pending} className="btn btn-primary flex-1">
                {pending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
