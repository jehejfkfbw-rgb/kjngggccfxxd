import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { syncLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Activity, FileSpreadsheet, Globe2, SquareTerminal } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { ApiCredentials } from "@/components/dash/api-credentials";
import { formatDateTimeAr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "الربط البرمجي" };

const typeLabel: Record<string, { label: string; cls: string }> = {
  manual: { label: "يدوي", cls: "chip-gray" },
  csv_import: { label: "استيراد ملف", cls: "chip-blue" },
  api: { label: "API", cls: "chip-gold" },
};

const statusChip: Record<string, { label: string; cls: string }> = {
  success: { label: "ناجحة", cls: "chip-green" },
  partial: { label: "جزئية", cls: "chip-gold" },
  failed: { label: "فاشلة", cls: "chip-red" },
};

export default async function IntegrationsPage() {
  const { university } = await requireUniversityAdmin();

  const logs = await db
    .select()
    .from(syncLogs)
    .where(eq(syncLogs.universityId, university.id))
    .orderBy(desc(syncLogs.createdAt))
    .limit(25);

  return (
    <div>
      <PageHeader title="الربط البرمجي والمزامنة" subtitle="اربط نظام جامعتك الداخلي بالمنصة عبر واجهة API آمنة وتابع كل عمليات المزامنة">
        <span className="chip chip-green"><Activity size={13} /> القناة نشطة</span>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApiCredentials apiKey={university.apiKey} />

        {/* Endpoint docs */}
        <div className="card-surface p-6">
          <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
            <SquareTerminal size={18} className="text-gold-400" />
            نقاط الاتصال المتاحة
          </h3>
          <div className="mt-5 space-y-3.5" dir="ltr">
            <div className="rounded-xl border border-white/8 bg-ink-950/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded bg-emerald-400/15 px-2 py-0.5 font-mono text-[0.68rem] font-bold text-emerald-300">GET</span>
                <code className="font-mono text-[0.78rem] text-white">/api/v1/students</code>
              </div>
              <p className="mt-2 text-end text-[0.74rem] text-mist-400" dir="rtl">سحب قائمة طلاب جامعتك كاملة (JSON).</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-ink-950/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded bg-azure-400/15 px-2 py-0.5 font-mono text-[0.68rem] font-bold text-azure-300">POST</span>
                <code className="font-mono text-[0.78rem] text-white">/api/v1/students</code>
              </div>
              <p className="mt-2 text-end text-[0.74rem] text-mist-400" dir="rtl">إنشاء أو تحديث سجلات الطلاب آلياً (Upsert بالرقم الجامعي).</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-ink-950/60 p-4">
              <p className="font-mono text-[0.68rem] leading-5 text-mist-300">
                <span className="text-mist-500"># المصادقة عبر الترويسات:</span><br />
                x-api-key: <span className="text-gold-300">afk_****</span><br />
                x-api-secret: <span className="text-gold-300">********</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-[0.76rem] text-mist-400">
            <Globe2 size={14} className="shrink-0 text-azure-300" />
            كل طلبات الـ API مسجلة في سجل المزامنة ولا تعرض سوى بيانات جامعتك.
          </div>
        </div>
      </div>

      {/* Sync log */}
      <div className="card-surface mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
            <FileSpreadsheet size={18} className="text-gold-400" />
            سجل المزامنة والعمليات
          </h3>
          <span className="chip chip-gray">آخر {logs.length} عملية</span>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl min-w-[760px]">
            <thead>
              <tr>
                <th>العملية</th>
                <th>النوع</th>
                <th>السجلات</th>
                <th>الحالة</th>
                <th>التفاصيل</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={6}><p className="py-12 text-center text-[0.86rem] text-mist-400">لا توجد عمليات مسجلة بعد.</p></td></tr>
              )}
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium text-white">{l.action}</td>
                  <td><span className={`chip ${typeLabel[l.type].cls}`}>{typeLabel[l.type].label}</span></td>
                  <td className="tnum" dir="ltr">{l.recordsCount}</td>
                  <td><span className={`chip ${statusChip[l.status].cls}`}>{statusChip[l.status].label}</span></td>
                  <td className="max-w-[240px] truncate text-[0.76rem] text-mist-400">{l.message ?? "—"}</td>
                  <td className="whitespace-nowrap text-[0.74rem] text-mist-500">{formatDateTimeAr(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
