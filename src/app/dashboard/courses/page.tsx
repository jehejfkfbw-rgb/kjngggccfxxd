import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { courses, departments, enrollments } from "@/db/schema";
import { asc, count, eq } from "drizzle-orm";
import { Clock3, GitBranch, Plus, Trash2, UserRound } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { createCourseAction, deleteCourseAction } from "@/lib/actions/university";
import { LEVELS_AR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "المواد الدراسية" };

export default async function CoursesPage() {
  const { university } = await requireUniversityAdmin();
  const uid = university.id;

  const [uniCourses, uniDepartments, enrollCounts] = await Promise.all([
    db.select().from(courses).where(eq(courses.universityId, uid)).orderBy(asc(courses.code)),
    db.select().from(departments).where(eq(departments.universityId, uid)).orderBy(asc(departments.name)),
    db.select({ courseId: enrollments.courseId, v: count() }).from(enrollments).groupBy(enrollments.courseId),
  ]);

  const validCourseIds = new Set(uniCourses.map((c) => c.id));

  return (
    <div>
      <PageHeader title="المواد الدراسية" subtitle="المواد المعتمدة بجامعتك — تظهر لطلابك فور تسجيلهم بها">
        <span className="chip chip-gold"><GitBranch size={13} /> {uniCourses.length} مادة</span>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="tbl min-w-[720px]">
              <thead>
                <tr>
                  <th>الكود</th>
                  <th>المادة</th>
                  <th>القسم</th>
                  <th>الفرقة</th>
                  <th>الساعات</th>
                  <th>المسجلون</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {uniCourses.length === 0 && (
                  <tr><td colSpan={7}><p className="py-12 text-center text-[0.86rem] text-mist-400">لا توجد مواد بعد — أضف أول مادة من النموذج.</p></td></tr>
                )}
                {uniCourses.map((c) => {
                  const dept = uniDepartments.find((d) => d.id === c.departmentId);
                  return (
                    <tr key={c.id}>
                      <td><span className="rounded-md bg-azure-400/10 px-2.5 py-1 font-mono text-[0.72rem] font-bold text-azure-300" dir="ltr">{c.code}</span></td>
                      <td>
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="flex items-center gap-1.5 text-[0.68rem] text-mist-500"><UserRound size={11} /> {c.instructor ?? "—"}</p>
                      </td>
                      <td className="text-[0.8rem]">{dept?.name ?? "—"}</td>
                      <td className="text-[0.8rem]">{LEVELS_AR[c.level ?? 1]}</td>
                      <td><span className="chip chip-gray"><Clock3 size={11} /> {c.creditHours}</span></td>
                      <td className="tnum font-semibold text-gold-300" dir="ltr">
                        {validCourseIds.has(c.id) ? enrollCounts.find((e) => e.courseId === c.id)?.v ?? 0 : 0}
                      </td>
                      <td>
                        <form action={deleteCourseAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button title="حذف المادة" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-rose-400/40 hover:text-rose-300">
                            <Trash2 size={13} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-surface h-fit p-6">
          <h3 className="font-display text-[0.98rem] font-semibold text-white">إضافة مادة دراسية</h3>
          <form action={createCourseAction} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">الكود *</label>
                <input name="code" required dir="ltr" className="input text-end" placeholder="CS301" />
              </div>
              <div>
                <label className="label">الساعات</label>
                <input name="creditHours" type="number" min={1} max={6} defaultValue={3} dir="ltr" className="input text-end" />
              </div>
            </div>
            <div>
              <label className="label">اسم المادة *</label>
              <input name="name" required className="input" placeholder="قواعد البيانات المتقدمة" />
            </div>
            <div>
              <label className="label">المحاضر</label>
              <input name="instructor" className="input" placeholder="د. أحمد السيد" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">القسم</label>
                <select name="departmentId" className="input" defaultValue="">
                  <option value="">— عام —</option>
                  {uniDepartments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">الفرقة</label>
                <select name="level" className="input" defaultValue={1}>
                  {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>{LEVELS_AR[l]}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-gold w-full"><Plus size={15} /> إضافة المادة</button>
          </form>
        </div>
      </div>
    </div>
  );
}
