import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { joinRequests, students, syncLogs, universities } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import {
  Activity,
  ArrowUpLeft,
  Ban,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Inbox,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { formatDateAr, timeAgoAr } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة المنصة" };

export default async function AdminOverview() {
  await requirePlatformAdmin();

  const [
    [totalUnis],
    [activeUnis],
    [suspendedUnis],
    [pendingRequests],
    [totalStudents],
    [activeStudents],
    recentRequests,
    recentUnis,
    [syncCount],
  ] = await Promise.all([
    db.select({ v: count() }).from(universities),
    db.select({ v: count() }).from(universities).where(eq(universities.status, "approved")),
    db.select({ v: count() }).from(universities).where(eq(universities.status, "suspended")),
    db.select({ v: count() }).from(joinRequests).where(eq(joinRequests.status, "pending")),
    db.select({ v: count() }).from(students),
    db.select({ v: count() }).from(students).where(eq(students.status, "active")),
    db.select().from(joinRequests).orderBy(desc(joinRequests.createdAt)).limit(5),
    db.select().from(universities).orderBy(desc(universities.createdAt)).limit(5),
    db.select({ v: count() }).from(syncLogs),
  ]);

  const stats = [
    { icon: Landmark, label: "إجمالي الجامعات", value: totalUnis.v, accent: "text-gold-300 bg-gold-400/10" },
    { icon: CheckCircle2, label: "جامعات نشطة ومعتمدة", value: activeUnis.v, accent: "text-emerald-300 bg-emerald-400/10" },
    { icon: GraduationCap, label: "الطلاب المسجلون", value: totalStudents.v, accent: "text-azure-300 bg-azure-400/10" },
    { icon: Inbox, label: "طلبات انضمام معلقة", value: pendingRequests.v, accent: "text-amber-300 bg-amber-400/10" },
  ];

  const health = activeUnis.v + suspendedUnis.v > 0 ? Math.round((activeUnis.v / (activeUnis.v + suspendedUnis.v)) * 100) : 100;

  return (
    <div>
      <PageHeader title="نظرة عامة على المنصة" subtitle="مؤشرات تشغيل Academic Future وطلبات انضمام الجامعات">
        <span className="chip chip-gold"><ShieldCheck size={13} /> وصول بصلاحيات عليا</span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface card-hover p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.accent}`}>
              <s.icon size={20} />
            </span>
            <p className="mt-5 font-display text-[1.9rem] font-bold leading-none text-white tnum" dir="ltr">
              {s.value.toLocaleString("en-US")}
            </p>
            <p className="mt-2 text-[0.8rem] font-medium text-mist-300">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Health strip */}
      <div className="card-surface mt-6 grid gap-px overflow-hidden !rounded-2xl sm:grid-cols-3">
        <div className="bg-white/[0.02] p-5">
          <div className="flex items-center justify-between text-[0.76rem] text-mist-400">
            <span>نسبة الجامعات النشطة</span>
            <span className="font-bold text-emerald-300 tnum" dir="ltr">{health}%</span>
          </div>
          <div className="progress-track mt-3"><div className="progress-fill !bg-gradient-to-l !from-emerald-500 !to-emerald-300" style={{ width: `${health}%` }} /></div>
        </div>
        <div className="bg-white/[0.02] p-5">
          <div className="flex items-center justify-between text-[0.76rem] text-mist-400">
            <span>طلاب نشطون من الإجمالي</span>
            <span className="font-bold text-azure-300 tnum" dir="ltr">{totalStudents.v ? Math.round((activeStudents.v / totalStudents.v) * 100) : 0}%</span>
          </div>
          <div className="progress-track mt-3"><div className="progress-fill !bg-gradient-to-l !from-azure-500 !to-azure-300" style={{ width: `${totalStudents.v ? Math.round((activeStudents.v / totalStudents.v) * 100) : 0}%` }} /></div>
        </div>
        <div className="bg-white/[0.02] p-5">
          <div className="flex items-center justify-between text-[0.76rem] text-mist-400">
            <span>إجمالي عمليات المزامنة</span>
            <span className="font-bold text-gold-300 tnum" dir="ltr">{syncCount.v.toLocaleString("en-US")}</span>
          </div>
          <div className="progress-track mt-3"><div className="progress-fill" style={{ width: "82%" }} /></div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Pending requests */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <Clock3 size={18} className="text-amber-300" />
              أحدث طلبات الانضمام
            </h3>
            <Link href="/secure-admin/requests" className="flex items-center gap-1.5 text-[0.76rem] font-semibold text-gold-400 hover:text-gold-300">
              إدارة الطلبات <ArrowUpLeft size={13} />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentRequests.length === 0 && (
              <p className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center text-[0.82rem] text-mist-400">لا توجد طلبات حالياً.</p>
            )}
            {recentRequests.map((r) => (
              <div key={r.id} className="flex items-center gap-3.5 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-azure-400/10 font-display text-[0.72rem] font-bold text-azure-300">
                  {r.universityName.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.86rem] font-semibold text-white">{r.universityName}</p>
                  <p className="text-[0.68rem] text-mist-500">{[r.city, r.country].filter(Boolean).join(" · ")} — {timeAgoAr(r.createdAt)}</p>
                </div>
                <span className={`chip shrink-0 ${r.status === "pending" ? "chip-gold" : r.status === "approved" ? "chip-green" : "chip-red"}`}>
                  {r.status === "pending" ? "معلق" : r.status === "approved" ? "معتمد" : "مرفوض"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent universities */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <Landmark size={18} className="text-gold-400" />
              الجامعات المسجلة مؤخراً
            </h3>
            <Link href="/secure-admin/universities" className="flex items-center gap-1.5 text-[0.76rem] font-semibold text-gold-400 hover:text-gold-300">
              كل الجامعات <ArrowUpLeft size={13} />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentUnis.length === 0 && (
              <p className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center text-[0.82rem] text-mist-400">لم تعتمد أي جامعة بعد.</p>
            )}
            {recentUnis.map((u) => (
              <div key={u.id} className="flex items-center gap-3.5 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-[0.7rem] font-bold text-white"
                  style={{ background: `linear-gradient(140deg, ${u.logoColor}, ${u.logoColor}44)` }}
                >
                  {u.code.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.86rem] font-semibold text-white">{u.name}</p>
                  <p className="text-[0.68rem] text-mist-500">انضمت {formatDateAr(u.createdAt)}</p>
                </div>
                {u.status === "suspended" ? (
                  <span className="chip chip-red shrink-0"><Ban size={11} /> موقوفة</span>
                ) : (
                  <span className="chip chip-green shrink-0"><Activity size={11} /> نشطة</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
