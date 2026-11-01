import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { syncLogs, universities } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/dash/shell";
import { Activity, ShieldAlert, CheckCircle2, XCircle, FileSpreadsheet } from "lucide-react";
import { formatDateTimeAr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "سجل المنصة الشامل" };

const typeLabel: Record<string, { label: string; cls: string; icon: any }> = {
  manual: { label: "يدوي", cls: "chip-gray", icon: CheckCircle2 },
  csv_import: { label: "استيراد", cls: "chip-blue", icon: FileSpreadsheet },
  api: { label: "API", cls: "chip-teal", icon: Activity },
};

const statusChip: Record<string, { label: string; cls: string }> = {
  success: { label: "ناجحة", cls: "chip-green" },
  partial: { label: "جزئية", cls: "chip-coral" },
  failed: { label: "فاشلة", cls: "chip-red" },
};

export default async function AdminLogsPage() {
  await requirePlatformAdmin();

  const logs = await db
    .select({
      log: syncLogs,
      uni: universities,
    })
    .from(syncLogs)
    .innerJoin(universities, eq(syncLogs.universityId, universities.id))
    .orderBy(desc(syncLogs.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <PageHeader title="مراقب العمليات المركزي" subtitle="متابعة لحظية لكل حركات البيانات والمزامنة عبر جميع الجامعات">
         <span className="chip chip-teal"><Activity size={13} /> {logs.length} عملية أخيرة</span>
      </PageHeader>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl min-w-[900px]">
            <thead>
              <tr>
                <th>الجامعة</th>
                <th>العملية</th>
                <th>النوع</th>
                <th>السجلات</th>
                <th>الحالة</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={6} className="py-14 text-center text-slate-500">لا توجد سجلات بعد.</td></tr>
              )}
              {logs.map(({ log: l, uni: u }) => {
                const TL = typeLabel[l.type];
                return (
                  <tr key={l.id}>
                    <td>
                      <p className="text-[0.84rem] font-bold text-white">{u.name}</p>
                      <p className="text-[0.68rem] text-slate-500 font-mono" dir="ltr">{u.code}</p>
                    </td>
                    <td>
                      <p className="text-[0.82rem] text-slate-200">{l.action}</p>
                      {l.message && <p className="text-[0.7rem] text-slate-500 truncate max-w-[200px] mt-0.5">{l.message}</p>}
                    </td>
                    <td>
                      <span className={`chip ${TL.cls}`}>
                        <TL.icon size={11} /> {TL.label}
                      </span>
                    </td>
                    <td className="tnum font-mono text-[0.8rem] text-slate-400" dir="ltr">{l.recordsCount}</td>
                    <td>
                      <span className={`chip ${statusChip[l.status].cls}`}>{statusChip[l.status].label}</span>
                    </td>
                    <td className="text-[0.7rem] text-slate-500 font-medium whitespace-nowrap">
                      {formatDateTimeAr(l.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
