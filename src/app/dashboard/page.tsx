import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import {
  announcements,
  colleges,
  courses,
  departments,
  students,
  syncLogs,
} from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import {
  Activity,
  ArrowUpLeft,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  FileSpreadsheet,
  GitBranch,
  Layers3,
  Users,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { formatDateTimeAr } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة تحكم الجامعة" };

const syncIcon = {
  manual: CheckCircle2,
  csv_import: FileSpreadsheet,
  api: Activity,
} as const;

export default async function DashboardHome() {
  const { university } = await requireUniversityAdmin();
  const uid = university.id;

  const [
    [studentCount],
    [activeCount],
    [collegeCount],
    [deptCount],
    [courseCount],
    [annCount],
    recentSyncs,
  ] = await Promise.all([
    db.select({ v: count() }).from(students).where(eq(students.universityId, uid)),
    db.select({ v: count() }).from(students).where(and(eq(students.universityId, uid), eq(students.status, "active"))),
    db.select({ v: count() }).from(colleges).where(eq(colleges.universityId, uid)),
    db.select({ v: count() }).from(departments).where(eq(departments.universityId, uid)),
    db.select({ v: count() }).from(courses).where(eq(courses.universityId, uid)),
    db.select({ v: count() }).from(announcements).where(eq(announcements.universityId, uid)),
    db.select().from(syncLogs).where(eq(syncLogs.universityId, uid)).orderBy(desc(syncLogs.createdAt)).limit(6),
  ]);

  const stats = [
    { icon: Users, label: "إجمالي الطلاب", value: studentCount.v, sub: `${activeCount.v} نشط`, href: "/dashboard/students" },
    { icon: Layers3, label: "الكليات", value: collegeCount.v, sub: `${deptCount.v} قسم أكاديمي`, href: "/dashboard/academics" },
    { icon: GitBranch, label: "المواد الدراسية", value: courseCount.v, sub: "معتمدة حالياً", href: "/dashboard/courses" },
    { icon: Bell, label: "الإعلانات", value: annCount.v, sub: "منشورة للطلاب", href: "/dashboard/announcements" },
  ];

  const lastSync = recentSyncs[0];
  const successRate =
    recentSyncs.length === 0
      ? 100
      : Math.round((recentSyncs.filter((s) => s.status === "success").length / recentSyncs.length) * 100);

  return (
    <div>
      <PageHeader title="لوحة القيادة" subtitle={`نظرة شاملة على بيانات ${university.name} داخل المنصة`}>
        <span className="chip chip-green"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" /> حساب جامعة معتمد</span>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card-surface card-hover group p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                <s.icon size={20} />
              </span>
              <ArrowUpLeft size={15} className="text-mist-600 transition-colors group-hover:text-gold-300" />
            </div>
            <p className="mt-5 font-display text-[1.9rem] font-bold leading-none text-white tnum" dir="ltr">
              {s.value.toLocaleString("en-US")}
            </p>
            <p className="mt-2 text-[0.8rem] font-medium text-mist-300">{s.label}</p>
            <p className="mt-0.5 text-[0.7rem] text-mist-500">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Sync status */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <Activity size={18} className="text-gold-400" />
              حالة مزامنة البيانات
            </h3>
            <Link href="/dashboard/integrations" className="text-[0.76rem] font-semibold text-gold-400 hover:text-gold-300">
              إدارة الربط
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[0.72rem] text-mist-400">آخر عملية مزامنة</p>
              <p className="mt-1.5 text-[0.82rem] font-semibold text-white">{lastSync ? formatDateTimeAr(lastSync.createdAt) : "لا يوجد بعد"}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[0.72rem] text-mist-400">معدل نجاح آخر العمليات</p>
              <p className="mt-1.5 font-display text-lg font-bold text-emerald-300 tnum" dir="ltr">{successRate}%</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {recentSyncs.length === 0 && (
              <p className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center text-[0.82rem] text-mist-400">
                لم تنفذ أي عمليات مزامنة بعد. ابدأ باستيراد بيانات الطلاب أو ربط الـ API.
              </p>
            )}
            {recentSyncs.map((s) => {
              const Icon = syncIcon[s.type];
              const ok = s.status === "success";
              const partial = s.status === "partial";
              return (
                <div key={s.id} className="flex items-center gap-3.5 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${ok ? "bg-emerald-400/10 text-emerald-300" : partial ? "bg-amber-400/10 text-amber-300" : "bg-rose-400/10 text-rose-300"}`}>
                    {ok ? <Icon size={15} /> : <XCircle size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.84rem] font-medium text-white">{s.action}</p>
                    <p className="text-[0.68rem] text-mist-500">{s.message ?? (s.recordsCount > 0 ? `${s.recordsCount} سجل` : "")}</p>
                  </div>
                  <span className="shrink-0 text-[0.68rem] text-mist-500">{formatDateTimeAr(s.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="card-surface ring-gold relative overflow-hidden p-6">
            <div className="absolute -end-14 -top-14 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <BookOpenCheck size={18} className="text-gold-400" />
              تحديث بيانات الطلاب
            </h3>
            <p className="mt-2.5 text-[0.82rem] leading-7 text-mist-400">
              أي تحديث تجريه هنا ينعكس فوراً على بوابات طلابك — المواد والجداول والنتائج والإعلانات.
            </p>
            <div className="mt-5 grid gap-2.5">
              <Link href="/dashboard/students" className="btn btn-gold !justify-start">
                <Users size={16} /> إضافة أو تعديل طالب
              </Link>
              <Link href="/dashboard/import" className="btn btn-ghost !justify-start">
                <FileSpreadsheet size={16} /> استيراد Excel / CSV
              </Link>
              <Link href="/dashboard/announcements" className="btn btn-ghost !justify-start">
                <Bell size={16} /> نشر إعلان للطلاب
              </Link>
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-display text-[1.02rem] font-semibold text-white">خصوصية البيانات</h3>
            <p className="mt-2.5 text-[0.82rem] leading-7 text-mist-400">
              بيانات جامعتك معزولة بالكامل داخل المنصة. لا يمكن لأي جامعة أخرى الاطلاع على سجلات طلابك أو تقاريرك.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-[0.78rem] text-emerald-200">
              <CheckCircle2 size={15} /> عزل كامل على مستوى قاعدة البيانات مفعّل
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
