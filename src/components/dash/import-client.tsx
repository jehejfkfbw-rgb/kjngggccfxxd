"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import * as XLSX from "xlsx";
import {
  CheckCircle2,
  Copy,
  DownloadCloud,
  FileSpreadsheet,
  Loader2,
  Table2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { importStudentsAction, type ImportResult, type ImportRow } from "@/lib/actions/university";

const FIELD_MAP: Record<string, keyof ImportRow> = {
  "studentnumber": "studentNumber",
  "الرقم الجامعي": "studentNumber",
  "الرقم_الجامعي": "studentNumber",
  "fullname": "fullName",
  "name": "fullName",
  "الاسم": "fullName",
  "اسم الطالب": "fullName",
  "email": "email",
  "البريد": "email",
  "البريد الإلكتروني": "email",
  "nationalid": "nationalId",
  "الرقم القومي": "nationalId",
  "college": "college",
  "الكلية": "college",
  "department": "department",
  "القسم": "department",
  "level": "level",
  "الفرقة": "level",
  "الفرقة الدراسية": "level",
  "gpa": "gpa",
  "المعدل": "gpa",
  "password": "password",
  "كلمة المرور": "password",
};

function normalizeRow(raw: Record<string, unknown>): ImportRow {
  const row: ImportRow = {};
  for (const [key, value] of Object.entries(raw)) {
    const mapped = FIELD_MAP[key.trim().toLowerCase()] ?? FIELD_MAP[key.trim()];
    if (mapped && value !== undefined && value !== null && value !== "") {
      (row as Record<string, unknown>)[mapped] = typeof value === "number" ? value : String(value).trim();
    }
  }
  return row;
}

export function ImportClient({ colleges, departments }: { colleges: string[]; departments: string[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const readFile = useCallback((file: File) => {
    setParseError("");
    setResult(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
        const mapped = raw.map(normalizeRow).filter((r) => r.studentNumber || r.fullName);
        if (mapped.length === 0) {
          setParseError("لم يتم العثور على سجلات صالحة. تأكد من أسماء الأعمدة في الملف.");
          setRows(null);
          return;
        }
        setRows(mapped);
      } catch {
        setParseError("تعذرت قراءة الملف. تأكد أنه ملف Excel (.xlsx) أو CSV صالح.");
        setRows(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const submit = () => {
    if (!rows) return;
    startTransition(async () => {
      const res = await importStudentsAction(rows);
      setResult(res);
      if (res.created + res.updated > 0) setRows(null);
    });
  };

  const downloadTemplate = () => {
    const header = ["studentNumber", "fullName", "email", "nationalId", "college", "department", "level", "gpa", "password"];
    const sample = ["20210001", "أحمد محمد الشريف", "ahmed@university.edu", "29901011234567", colleges[0] ?? "كلية الهندسة", departments[0] ?? "هندسة البرمجيات", "3", "3.45", ""];
    const ws = XLSX.utils.aoa_to_sheet([header, sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "students");
    XLSX.writeFile(wb, "students-template.xlsx");
  };

  const copyCredentials = () => {
    if (!result) return;
    const text = result.credentials.map((c) => `${c.studentNumber}\t${c.fullName}\t${c.password}`).join("\n");
    navigator.clipboard.writeText(`الرقم الجامعي\tالاسم\tكلمة المرور\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Left: instructions + template */}
      <div className="space-y-5">
        <div className="card-surface p-6">
          <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
            <Table2 size={18} className="text-gold-400" />
            تنسيق الملف المطلوب
          </h3>
          <p className="mt-2.5 text-[0.8rem] leading-7 text-mist-400">
            الصف الأول يحتوي أسماء الأعمدة. يدعم النظام الأسماء الإنجليزية أو العربية:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/8" dir="ltr">
            <table className="w-full text-[0.72rem]">
              <tbody>
                {[
                  ["studentNumber", "الرقم الجامعي", true],
                  ["fullName", "الاسم الكامل", true],
                  ["email", "البريد الجامعي", false],
                  ["nationalId", "الرقم القومي", false],
                  ["college", "اسم الكلية (كما هو مسجل)", false],
                  ["department", "اسم القسم", false],
                  ["level", "الفرقة (1-5)", false],
                  ["gpa", "المعدل التراكمي (0-4)", false],
                  ["password", "كلمة مرور (اختياري - تُولّد تلقائياً)", false],
                ].map(([f, d, req]) => (
                  <tr key={f as string} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-2 font-mono text-azure-300">{f as string}</td>
                    <td className="px-3 py-2 text-end text-mist-400">{d as string}</td>
                    <td className="px-3 py-2 text-center">{req ? <span className="text-gold-300">مطلوب</span> : <span className="text-mist-600">اختياري</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={downloadTemplate} className="btn btn-ghost mt-5 w-full">
            <DownloadCloud size={16} /> تحميل ملف نموذجي (xlsx)
          </button>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-display text-[0.95rem] font-semibold text-white">قواعد الاستيراد</h3>
          <ul className="mt-3 space-y-2.5 text-[0.78rem] leading-6 text-mist-400">
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-emerald-300" /> إذا كان الرقم الجامعي موجوداً مسبقاً يتم تحديث بياناته دون تغيير كلمة مروره.</li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-emerald-300" /> الطلاب الجدد بدون كلمة مرور يحصلون على كلمة مولّدة تُعرض مرة واحدة بعد الاستيراد.</li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-emerald-300" /> أسماء الكليات والأقسام يجب أن تطابق المسجلة في صفحة «الكليات والأقسام».</li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-emerald-300" /> كل عملية استيراد تُسجل في سجل المزامنة.</li>
          </ul>
        </div>
      </div>

      {/* Right: upload + preview */}
      <div className="space-y-5">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) readFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`card-surface flex cursor-pointer flex-col items-center gap-3 border-dashed p-12 text-center transition-all duration-300 ${
            dragging ? "!border-gold-500/60 bg-gold-400/[0.05]" : "hover:border-white/20"
          }`}
          style={{ borderStyle: "dashed" }}
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-400/10 text-gold-300">
            <UploadCloud size={28} />
          </span>
          <p className="font-display text-[1.05rem] font-semibold text-white">أسقط ملف Excel أو CSV هنا</p>
          <p className="text-[0.78rem] text-mist-500">xlsx · xls · csv — حتى 2000 سجل في المرة</p>
          {fileName && <p className="chip chip-blue mt-2" dir="ltr"><FileSpreadsheet size={12} /> {fileName}</p>}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
          />
        </div>

        {parseError && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-400/25 bg-rose-400/[0.07] px-4 py-3.5 text-[0.84rem] text-rose-200">
            <XCircle size={17} className="shrink-0" /> {parseError}
          </div>
        )}

        {/* Preview */}
        {rows && !pending && (
          <div className="card-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <p className="text-[0.9rem] font-semibold text-white">معاينة البيانات — <span className="text-gold-300 tnum" dir="ltr">{rows.length}</span> سجل</p>
              <button onClick={submit} className="btn btn-gold !py-2.5">
                <CheckCircle2 size={15} /> اعتماد الاستيراد
              </button>
            </div>
            <div className="max-h-[380px] overflow-auto">
              <table className="tbl min-w-[640px]">
                <thead>
                  <tr><th>#</th><th>الرقم الجامعي</th><th>الاسم</th><th>الكلية</th><th>القسم</th><th>الفرقة</th></tr>
                </thead>
                <tbody>
                  {rows.slice(0, 50).map((r, i) => (
                    <tr key={i}>
                      <td className="tnum text-mist-500" dir="ltr">{i + 1}</td>
                      <td className="font-mono text-[0.75rem] text-azure-300" dir="ltr">{r.studentNumber || <span className="text-rose-300">مفقود</span>}</td>
                      <td className="font-medium text-white">{r.fullName || <span className="text-rose-300">مفقود</span>}</td>
                      <td className="text-[0.8rem]">{String(r.college ?? "—")}</td>
                      <td className="text-[0.8rem]">{String(r.department ?? "—")}</td>
                      <td className="tnum" dir="ltr">{String(r.level ?? "1")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 50 && (
                <p className="border-t border-white/8 px-5 py-3 text-center text-[0.74rem] text-mist-500">
                  ... و{rows.length - 50} سجل إضافي — سيتم استيرادها جميعاً
                </p>
              )}
            </div>
          </div>
        )}

        {pending && (
          <div className="card-surface flex items-center justify-center gap-3 p-12">
            <Loader2 size={22} className="animate-spin text-gold-300" />
            <p className="text-[0.9rem] text-mist-300">جارٍ استيراد السجلات وتوليد بيانات الدخول...</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="card-surface overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-white/5">
              <div className="bg-ink-900 p-5 text-center">
                <p className="font-display text-2xl font-bold text-emerald-300 tnum" dir="ltr">{result.created}</p>
                <p className="mt-1 text-[0.72rem] text-mist-400">سجل جديد</p>
              </div>
              <div className="bg-ink-900 p-5 text-center">
                <p className="font-display text-2xl font-bold text-azure-300 tnum" dir="ltr">{result.updated}</p>
                <p className="mt-1 text-[0.72rem] text-mist-400">سجل محدث</p>
              </div>
              <div className="bg-ink-900 p-5 text-center">
                <p className={`font-display text-2xl font-bold tnum ${result.failed > 0 ? "text-rose-300" : "text-mist-500"}`} dir="ltr">{result.failed}</p>
                <p className="mt-1 text-[0.72rem] text-mist-400">سجل فاشل</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-40 space-y-1.5 overflow-y-auto border-t border-white/8 p-4">
                {result.errors.slice(0, 12).map((e, i) => (
                  <p key={i} className="flex items-center gap-2 text-[0.76rem] text-rose-300"><XCircle size={12} /> {e}</p>
                ))}
              </div>
            )}

            {result.credentials.length > 0 && (
              <div className="border-t border-white/8 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[0.86rem] font-semibold text-white">بيانات دخول الطلاب الجدد ({result.credentials.length})</p>
                  <button onClick={copyCredentials} className="btn btn-ghost !px-3.5 !py-2 !text-xs">
                    {copied ? <CheckCircle2 size={13} className="text-emerald-300" /> : <Copy size={13} />}
                    {copied ? "تم النسخ" : "نسخ الكل"}
                  </button>
                </div>
                <p className="mt-1.5 text-[0.7rem] text-amber-300">تُعرض هذه البيانات مرة واحدة فقط — انسخها وشاركها مع الطلاب عبر قناة آمنة.</p>
                <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-white/8">
                  <table className="tbl">
                    <tbody>
                      {result.credentials.map((c, i) => (
                        <tr key={i}>
                          <td className="font-mono text-[0.74rem] text-azure-300" dir="ltr">{c.studentNumber}</td>
                          <td className="text-[0.8rem]">{c.fullName}</td>
                          <td className="font-mono text-[0.74rem] font-bold text-gold-300" dir="ltr">{c.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
