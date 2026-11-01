import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookOpenCheck, Clock4, KeySquare, UserRound } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { LEVELS_AR, gradeColor } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "موادي الدراسية" };

export default async function CoursesPage() {
  const { user: student } = await requireStudent();

  const rows = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, student.id));

  const current = rows.filter((r) => r.enrollment.status === "enrolled");
  const done = rows.filter((r) => r.enrollment.status === "completed");
  const totalHours = current.reduce((s, r) => s + r.course.creditHours, 0);

  return (
    <div>
      <PageHeader title="موادي الدراسية" subtitle="المواد المسجلة والمكتملة كما اعتمدتها جامعتك">
        <span className="chip chip-blue"><Clock4 size={13} /> {totalHours} ساعة هذا الفصل</span>
      </PageHeader>

      <h2 className="mb-4 flex items-center gap-2 font-display text-[1.05rem] font-semibold text-white">
        <BookOpenCheck size={18} className="text-gold-400" />
        الفصل الدراسي الحالي ({current.length})
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {current.length === 0 && (
          <p className="card-surface p-6 text-center text-[0.86rem] text-mist-400 md:col-span-2">
            لم يتم تسجيل مواد للفصل الحالي بعد — ستظهر هنا فور اعتمادها من الجامعة.
          </p>
        )}
        {current.map(({ course }) => (
          <div key={course.id} className="card-surface card-hover p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-lg bg-azure-400/10 px-3 py-1.5 font-mono text-[0.72rem] font-bold text-azure-300" dir="ltr">{course.code}</span>
              <span className="chip chip-gray !text-[0.68rem]">{LEVELS_AR[course.level ?? 1]}</span>
            </div>
            <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-white">{course.name}</h3>
            <div className="mt-4 space-y-2 border-t border-white/6 pt-4 text-[0.8rem] text-mist-400">
              <p className="flex items-center gap-2"><UserRound size={14} className="text-mist-500" /> {course.instructor ?? "يحدد لاحقاً"}</p>
              <p className="flex items-center gap-2"><Clock4 size={14} className="text-mist-500" /> {course.creditHours} ساعات معتمدة · {course.semester}</p>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 flex items-center gap-2 font-display text-[1.05rem] font-semibold text-white">
            <KeySquare size={18} className="text-emerald-300" />
            مواد مكتملة ({done.length})
          </h2>
          <div className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="tbl min-w-[620px]">
                <thead>
                  <tr>
                    <th>الكود</th>
                    <th>المادة</th>
                    <th>الفصل</th>
                    <th>الساعات</th>
                    <th>الدرجة</th>
                    <th>التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  {done.map(({ enrollment, course }) => (
                    <tr key={enrollment.id}>
                      <td className="font-mono text-[0.75rem] text-azure-300" dir="ltr">{course.code}</td>
                      <td className="font-medium text-white">{course.name}</td>
                      <td>{enrollment.semester}</td>
                      <td className="tnum" dir="ltr">{course.creditHours}</td>
                      <td className="tnum font-semibold" dir="ltr">{enrollment.score ? `${parseFloat(enrollment.score)}%` : "—"}</td>
                      <td><span className={`chip border ${gradeColor(enrollment.grade)} !px-2.5 font-bold`} dir="ltr">{enrollment.grade ?? "—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
