import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import {
  announcements,
  colleges,
  courses,
  departments,
  enrollments,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import {
  Bell,
  BookOpenCheck,
  Building2,
  CalendarClock,
  GraduationCap,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { LEVELS_AR, formatDateAr, gradeColor } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "بوابة الطالب" };

export default async function PortalHome() {
  const { user: student, university } = await requireStudent();

  const [college] = student.collegeId
    ? await db.select().from(colleges).where(eq(colleges.id, student.collegeId)).limit(1)
    : [null];
  const [department] = student.departmentId
    ? await db.select().from(departments).where(eq(departments.id, student.departmentId)).limit(1)
    : [null];

  const myEnrollments = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, student.id));

  const enrolled = myEnrollments.filter((e) => e.enrollment.status === "enrolled");
  const completed = myEnrollments.filter((e) => e.enrollment.status === "completed");

  const myAnnouncements = await db
    .select()
    .from(announcements)
    .where(and(eq(announcements.universityId, university.id)))
    .orderBy(desc(announcements.pinned), desc(announcements.createdAt))
    .limit(4);

  const gpa = parseFloat(student.gpa ?? "0");

  return (
    <div>
      <PageHeader
        title={`مرحباً، ${student.fullName.split(" ")[0]} ${student.fullName.split(" ")[1] ?? ""}`}
        subtitle={`${university.name} · آخر تحديث لبياناتك: ${formatDateAr(student.updatedAt)}`}
      >
        <span className="chip chip-green"><Sparkles size={13} /> حساب معتمد من الجامعة</span>
      </PageHeader>

      {/* Profile hero card */}
      <div className="ring-gold card-surface relative overflow-hidden p-6 md:p-8">
        <div className="absolute -start-20 -top-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex items-start gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 font-display text-xl font-bold text-ink-950">
                {student.fullName.trim().split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-white">{student.fullName}</h2>
                <p className="mt-1 text-[0.82rem] text-mist-400 tnum" dir="ltr">ID · {student.studentNumber}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip chip-blue"><Building2 size={12} /> {college?.name ?? "—"}</span>
                  <span className="chip chip-gold"><Layers3 size={12} /> {department?.name ?? "—"}</span>
                  <span className="chip chip-gray"><GraduationCap size={12} /> {LEVELS_AR[student.level] ?? `الفرقة ${student.level}`}</span>
                </div>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                <p className="font-display text-2xl font-bold text-white tnum" dir="ltr">{student.totalCredits}</p>
                <p className="mt-1 text-[0.68rem] text-mist-400">ساعة معتمدة</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                <p className="font-display text-2xl font-bold text-white tnum" dir="ltr">{enrolled.length}</p>
                <p className="mt-1 text-[0.68rem] text-mist-400">مادة هذا الفصل</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                <p className="font-display text-2xl font-bold text-white tnum" dir="ltr">{completed.length}</p>
                <p className="mt-1 text-[0.68rem] text-mist-400">مادة مكتملة</p>
              </div>
            </div>
          </div>

          {/* GPA dial */}
          <div className="flex items-center justify-center">
            <div className="relative grid place-items-center">
              <svg width="190" height="190" viewBox="0 0 200 200" className="-rotate-90">
                <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="13" />
                <circle
                  cx="100" cy="100" r="84" fill="none"
                  stroke="url(#gpaGrad)" strokeWidth="13" strokeLinecap="round"
                  strokeDasharray={`${(Math.min(gpa, 4) / 4) * 527.8} 527.8`}
                />
                <defs>
                  <linearGradient id="gpaGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f5d98a" />
                    <stop offset="100%" stopColor="#b8892e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <TrendingUp size={16} className="text-gold-400" />
                <p className="mt-1 font-display text-4xl font-bold text-white tnum" dir="ltr">{gpa.toFixed(2)}</p>
                <p className="mt-1 text-[0.7rem] text-mist-400">المعدل التراكمي من 4.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Current courses */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <BookOpenCheck size={18} className="text-gold-400" />
              مواد الفصل الحالي
            </h3>
            <Link href="/portal/courses" className="text-[0.76rem] font-semibold text-gold-400 hover:text-gold-300">عرض الكل</Link>
          </div>
          <div className="mt-5 space-y-3">
            {enrolled.length === 0 && (
              <p className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center text-[0.84rem] text-mist-400">
                لم تسجل جامعتك مواد للفصل الحالي بعد.
              </p>
            )}
            {enrolled.slice(0, 4).map(({ course }) => (
              <div key={course.id} className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-gold-500/25">
                <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-azure-400/10 font-mono text-[0.68rem] font-bold text-azure-300" dir="ltr">
                  {course.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.88rem] font-semibold text-white">{course.name}</p>
                  <p className="text-[0.72rem] text-mist-500">{course.instructor ?? "—"} · {course.creditHours} ساعات</p>
                </div>
                <CalendarClock size={15} className="shrink-0 text-mist-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
              <Bell size={18} className="text-gold-400" />
              آخر الإعلانات
            </h3>
            <Link href="/portal/announcements" className="text-[0.76rem] font-semibold text-gold-400 hover:text-gold-300">الكل</Link>
          </div>
          <div className="mt-5 space-y-3">
            {myAnnouncements.length === 0 && (
              <p className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center text-[0.84rem] text-mist-400">
                لا توجد إعلانات منشورة حالياً.
              </p>
            )}
            {myAnnouncements.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  {a.pinned && <span className="chip chip-gold !px-2 !py-0.5 !text-[0.62rem]">مثبت</span>}
                  {a.level && <span className="chip chip-blue !px-2 !py-0.5 !text-[0.62rem]">{LEVELS_AR[a.level]}</span>}
                  <p className="truncate text-[0.86rem] font-semibold text-white">{a.title}</p>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-6 text-mist-400">{a.body}</p>
                <p className="mt-2 text-[0.66rem] text-mist-500">{formatDateAr(a.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent grades preview */}
      {completed.length > 0 && (
        <div className="card-surface mt-6 p-6">
          <h3 className="flex items-center gap-2.5 font-display text-[1.02rem] font-semibold text-white">
            <TrendingUp size={18} className="text-gold-400" />
            أحدث النتائج المعتمدة
          </h3>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
            {completed.slice(0, 6).map(({ enrollment, course }) => (
              <div key={enrollment.id} className="min-w-[190px] rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <p className="font-mono text-[0.66rem] text-mist-500" dir="ltr">{course.code}</p>
                <p className="mt-1.5 truncate text-[0.84rem] font-semibold text-white">{course.name}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className={`chip border ${gradeColor(enrollment.grade)} !px-2.5 !py-0.5 font-bold`} dir="ltr">
                    {enrollment.grade ?? "—"}
                  </span>
                  <span className="font-display text-lg font-bold text-white tnum" dir="ltr">
                    {enrollment.score ? parseFloat(enrollment.score).toFixed(0) : "—"}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
