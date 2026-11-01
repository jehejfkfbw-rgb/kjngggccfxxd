"use client";

import { useActionState, useRef, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Copy,
  FileText,
  Globe2,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { JoinRequest } from "@/db/schema";
import { approveJoinRequestAction, rejectJoinRequestAction, type ApproveResult } from "@/lib/actions/admin";
import { formatDateAr, cn } from "@/lib/utils";

const statusChip: Record<string, { cls: string; label: string }> = {
  pending: { cls: "chip-gold", label: "قيد المراجعة" },
  approved: { cls: "chip-green", label: "معتمدة" },
  rejected: { cls: "chip-red", label: "مرفوضة" },
};

export function RequestsManager({ requests }: { requests: JoinRequest[] }) {
  const [selected, setSelected] = useState<JoinRequest | null>(null);
  const [mode, setMode] = useState<"approve" | "reject" | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [approveState, approveAction, approvePending] = useActionState<ApproveResult, FormData>(
    approveJoinRequestAction,
    null
  );

  const open = (r: JoinRequest, m: "approve" | "reject") => {
    setSelected(r);
    setMode(m);
    setCopied(false);
    dialogRef.current?.showModal();
  };

  const suggestedCode = selected
    ? (selected.universityNameEn ?? selected.universityName)
        .split(" ")
        .filter((w) => w.length > 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 6) || "UNI"
    : "";

  const close = () => {
    dialogRef.current?.close();
    setMode(null);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      {requests.map((r) => {
        const st = statusChip[r.status];
        return (
          <div key={r.id} className="card-surface card-hover p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-azure-500/20 to-azure-500/5 p-3 font-display text-sm font-bold text-azure-300">
                  {r.universityName.slice(0, 2)}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-[1.05rem] font-semibold text-white">{r.universityName}</h3>
                    <span className={cn("chip", st.cls)}>{st.label}</span>
                    <span className="chip chip-gray">{r.ssoType === "google" ? "Google Workspace" : "دخول تقليدي"}</span>
                  </div>
                  {r.universityNameEn && <p className="mt-0.5 text-[0.74rem] text-mist-500" dir="ltr">{r.universityNameEn}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.76rem] text-mist-400">
                    <span className="flex items-center gap-1.5"><Building2 size={12} className="text-mist-500" /> {[r.city, r.country].filter(Boolean).join(" · ")}</span>
                    <span className="flex items-center gap-1.5" dir="ltr"><Mail size={12} className="text-mist-500" /> {r.contactEmail}</span>
                    {r.contactPhone && <span className="flex items-center gap-1.5" dir="ltr"><Phone size={12} className="text-mist-500" /> {r.contactPhone}</span>}
                    {r.website && <span className="flex items-center gap-1.5" dir="ltr"><Globe2 size={12} className="text-mist-500" /> {r.website}</span>}
                    {r.studentsCount != null && <span className="flex items-center gap-1.5"><Users size={12} className="text-mist-500" /> {r.studentsCount.toLocaleString("en-US")} طالب</span>}
                  </div>
                  <p className="mt-2 text-[0.72rem] text-mist-500">المسؤول: {r.contactName} · قُدّم بتاريخ {formatDateAr(r.createdAt)}</p>
                </div>
              </div>

              {r.status === "pending" && (
                <div className="flex shrink-0 items-center gap-2.5">
                  <button onClick={() => open(r, "reject")} className="btn btn-danger !py-2.5">
                    <XCircle size={15} /> رفض
                  </button>
                  <button onClick={() => open(r, "approve")} className="btn btn-gold !py-2.5">
                    <CheckCircle2 size={15} /> اعتماد وتفعيل
                  </button>
                </div>
              )}
            </div>

            {r.message && (
              <p className="mt-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 text-[0.82rem] leading-7 text-mist-300">{r.message}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {(r.documents ?? []).map((d, i) => (
                <span key={i} className="chip chip-blue" dir="ltr">
                  <FileText size={12} /> {d.name} {d.size ? `· ${d.size}` : ""}
                </span>
              ))}
            </div>

            {r.reviewNote && (
              <p className="mt-3 text-[0.76rem] text-rose-300">ملاحظة المراجعة: {r.reviewNote}</p>
            )}
          </div>
        );
      })}

      {/* Approve / Reject dialog */}
      <dialog ref={dialogRef} className="modal-dialog" onClose={close}>
        <div className="ring-gold card-surface p-7">
          {mode === "approve" && !approveState?.adminEmail && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">اعتماد {selected?.universityName}</h2>
                <button onClick={close} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 hover:text-white"><X size={15} /></button>
              </div>
              <p className="mt-2 text-[0.82rem] leading-7 text-mist-400">
                سيتم إنشاء حساب الجامعة وحساب المسؤول ومفاتيح API فوراً، ويظهر لك بيانات الدخول لتسليمها للجامعة.
              </p>
              {approveState?.error && (
                <p className="mt-4 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-[0.82rem] text-rose-200">{approveState.error}</p>
              )}
              <form action={approveAction} className="mt-6 space-y-4">
                <input type="hidden" name="requestId" value={selected?.id ?? ""} />
                <div>
                  <label className="label">كود الجامعة على المنصة * (إنجليزي، بدون مسافات)</label>
                  <input name="code" required dir="ltr" defaultValue={suggestedCode} className="input text-end font-mono" placeholder="FU" />
                </div>
                <div>
                  <label className="label">نظام دخول الطلاب المعتمد</label>
                  <select name="ssoType" className="input" defaultValue={selected?.ssoType ?? "password"}>
                    <option value="password">الرقم الجامعي + كلمة المرور</option>
                    <option value="google">Google Workspace SSO</option>
                  </select>
                </div>
                {selected?.ssoType === "google" && (
                  <div>
                    <label className="label">نطاق Google المعتمد</label>
                    <input name="googleDomain" dir="ltr" defaultValue={selected?.googleDomain ?? ""} className="input text-end font-mono" placeholder="university.edu" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button type="button" onClick={close} className="btn btn-ghost">تراجع</button>
                  <button type="submit" disabled={approvePending} className="btn btn-gold disabled:opacity-60">
                    {approvePending ? "جارٍ التفعيل..." : "تأكيد الاعتماد"}
                  </button>
                </div>
              </form>
            </>
          )}

          {mode === "approve" && approveState?.adminEmail && (
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck size={30} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-white">تم اعتماد الجامعة وتفعيل حسابها</h2>
              <p className="mt-2 text-[0.82rem] text-mist-400">
                سلّم بيانات الدخول التالية إلى مسؤول الجامعة عبر قناة رسمية آمنة. لن تظهر كلمة المرور مرة أخرى.
              </p>
              <div className="mt-6 space-y-2.5 text-start">
                {[
                  ["كود الجامعة", approveState.universityCode],
                  ["بريد المسؤول", approveState.adminEmail],
                  ["كلمة المرور المؤقتة", approveState.adminPassword],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3">
                    <span className="text-[0.74rem] text-mist-400">{l}</span>
                    <code className="font-mono text-[0.84rem] font-bold text-gold-300" dir="ltr">{v}</code>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Academic Future — بيانات دخول الجامعة\nكود الجامعة: ${approveState.universityCode}\nالبريد: ${approveState.adminEmail}\nكلمة المرور: ${approveState.adminPassword}\nرابط الدخول: /login/university`
                  );
                  setCopied(true);
                }}
                className="btn btn-ghost mt-5 w-full"
              >
                {copied ? <CheckCircle2 size={15} className="text-emerald-300" /> : <Copy size={15} />}
                {copied ? "تم النسخ" : "نسخ بيانات التسليم"}
              </button>
              <button onClick={() => { close(); window.location.reload(); }} className="btn btn-gold mt-3 w-full">إغلاق</button>
            </div>
          )}

          {mode === "reject" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">رفض طلب {selected?.universityName}</h2>
                <button onClick={close} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 hover:text-white"><X size={15} /></button>
              </div>
              <form
                action={async (fd) => {
                  await rejectJoinRequestAction(fd);
                  close();
                }}
                className="mt-5 space-y-4"
              >
                <input type="hidden" name="requestId" value={selected?.id ?? ""} />
                <div>
                  <label className="label">سبب الرفض (يظهر في سجل المراجعة)</label>
                  <textarea name="note" rows={3} className="input resize-none" placeholder="مثال: مستندات الاعتماد غير واضحة..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={close} className="btn btn-ghost">تراجع</button>
                  <button type="submit" className="btn btn-danger">تأكيد الرفض</button>
                </div>
              </form>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
