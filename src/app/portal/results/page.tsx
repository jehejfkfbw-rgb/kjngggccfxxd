import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Award, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { ChangePasswordCard } from "@/components/dash/password-card";
import { gradeColor, gpaFromScore } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "النتائج والسجلات" };

export default async function ResultsPage() {
  const { user: student } = await requireStudent();

  const rows = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, student.id));

  const done = rows.filter((r) => r.enrollment.status === "completed" && r.enrollment.score != null);

  const bySemester = new Map<string, { rows: typeof done; totalPoints: number; totalHours: number }>();
  for (const r of done) {
    const sem = r.enrollment.semester;
    const entry = bySemester.get(sem) ?? { rows: [], totalPoints: 0, totalHours: 0 };
    entry.rows.push(r);
    const score = parseFloat(r.enrollment.score ?? "0");
    entry.totalPoints += gpaFromScore(score) * r.course.creditHours;
    entry.totalHours += r.course.creditHours;
    bySemester.set(sem, entry);
  }

  const gpa = parseFloat(student.gpa ?? "0");

  return (
    <div>
      <PageHeader title="النتائج والسجلات الأكاديمية" subtitle="سجلّك المعتمد رسمياً من جامعتك لكل الفصول الدراسية">
        <span className="chip chip-gold"><Award size={13} /> المعدل التراكمي <span className="font-bold tnum" dir="ltr">{gpa.toFixed(2)}</span></span>
      </PageHeader>

      {bySemester.size === 0 && (
        <div className="card-surface p-12 text-center">
          <ListChecks size={36} className="mx-auto text-mist-500" />
          <p className="mt-4 text-[0.9rem] text-mist-400">لم تعتمد جامعتك أي نتائج بعد — ستظهر هنا فور نشرها.</p>
        </div>
      )}

      <div className="space-y-6">
        {[...bySemester.entries()].map(([sem, data]) => {
          const semGpa = data.totalHours > 0 ? data.totalPoints / data.totalHours : 0;
          return (
            <div key={sem} className="card-surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-white/[0.02] px-6 py-4">
                <h2 className="font-display text-[1rem] font-semibold text-white">{sem}</h2>
                <div className="flex items-center gap-5 text-[0.8rem] text-mist-400">
                  <span>الساعات: <span className="font-bold text-white tnum" dir="ltr">{data.totalHours}</span></span>
                  <span>معدل الفصل: <span className="font-bold text-gold-300 tnum" dir="ltr">{semGpa.toFixed(2)}</span></span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="tbl min-w-[640px]">
                  <thead>
                    <tr>
                      <th>الكود</th>
                      <th>المادة</th>
                      <th>الساعات</th>
                      <th>الدرجة</th>
                      <th>التقدير</th>
                      <th>النقاط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map(({ enrollment, course }) => {
                      const score = parseFloat(enrollment.score ?? "0");
                      return (
                        <tr key={enrollment.id}>
                          <td className="font-mono text-[0.75rem] text-azure-300" dir="ltr">{course.code}</td>
                          <td className="font-medium text-white">{course.name}</td>
                          <td className="tnum" dir="ltr">{course.creditHours}</td>
                          <td className="tnum font-semibold" dir="ltr">{score}%</td>
                          <td><span className={`chip border ${gradeColor(enrollment.grade)} !px-2.5 font-bold`} dir="ltr">{enrollment.grade}</span></td>
                          <td className="tnum text-gold-300" dir="ltr">{gpaFromScore(score).toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <ChangePasswordCard />
      </div>
    </div>
  );
}
