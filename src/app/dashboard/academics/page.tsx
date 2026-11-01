import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { colleges, departments, students } from "@/db/schema";
import { asc, count, eq } from "drizzle-orm";
import { Building2, Layers3, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import {
  createCollegeAction,
  createDepartmentAction,
  deleteCollegeAction,
  deleteDepartmentAction,
} from "@/lib/actions/university";

export const dynamic = "force-dynamic";
export const metadata = { title: "الكليات والأقسام" };

export default async function AcademicsPage() {
  const { university } = await requireUniversityAdmin();
  const uid = university.id;

  const [uniColleges, uniDepartments] = await Promise.all([
    db.select().from(colleges).where(eq(colleges.universityId, uid)).orderBy(asc(colleges.name)),
    db.select().from(departments).where(eq(departments.universityId, uid)).orderBy(asc(departments.name)),
  ]);

  const deptCounts = await db
    .select({ collegeId: departments.collegeId, v: count() })
    .from(departments)
    .where(eq(departments.universityId, uid))
    .groupBy(departments.collegeId);

  const studentCounts = await db
    .select({ collegeId: students.collegeId, v: count() })
    .from(students)
    .where(eq(students.universityId, uid))
    .groupBy(students.collegeId);

  return (
    <div>
      <PageHeader title="الكليات والأقسام" subtitle="إدارة الهيكل الأكاديمي لجامعتك: الكليات، الأقسام، والفرق الدراسية" />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Colleges list */}
        <div className="space-y-4">
          {uniColleges.length === 0 && (
            <div className="card-surface p-10 text-center">
              <Building2 size={32} className="mx-auto text-mist-500" />
              <p className="mt-3 text-[0.88rem] text-mist-400">أضف أول كلية في جامعتك من النموذج الجانبي.</p>
            </div>
          )}
          {uniColleges.map((c) => (
            <div key={c.id} className="card-surface p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                    <Building2 size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.02rem] font-semibold text-white">{c.name}</h3>
                    <p className="mt-0.5 text-[0.72rem] text-mist-500" dir="ltr">{c.nameEn ?? ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="chip chip-blue">{studentCounts.find((s) => s.collegeId === c.id)?.v ?? 0} طالب</span>
                  <form action={deleteCollegeAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button title="حذف الكلية" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-rose-400/40 hover:text-rose-300">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Departments of this college */}
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {uniDepartments.filter((d) => d.collegeId === c.id).map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                    <Layers3 size={15} className="shrink-0 text-azure-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.84rem] font-medium text-white">{d.name}</p>
                      {d.nameEn && <p className="truncate text-[0.66rem] text-mist-500" dir="ltr">{d.nameEn}</p>}
                    </div>
                    <form action={deleteDepartmentAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button title="حذف القسم" className="text-mist-600 transition-colors hover:text-rose-300">
                        <Trash2 size={13} />
                      </button>
                    </form>
                  </div>
                ))}
                {uniDepartments.filter((d) => d.collegeId === c.id).length === 0 && (
                  <p className="text-[0.76rem] text-mist-600">لا أقسام بعد — أضف قسماً من النموذج.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Forms */}
        <div className="space-y-5">
          <div className="card-surface p-6">
            <h3 className="font-display text-[0.98rem] font-semibold text-white">إضافة كلية</h3>
            <form action={createCollegeAction} className="mt-4 space-y-3.5">
              <div>
                <label className="label">اسم الكلية *</label>
                <input name="name" required className="input" placeholder="كلية الهندسة وتقنية المعلومات" />
              </div>
              <div>
                <label className="label">الاسم بالإنجليزية</label>
                <input name="nameEn" dir="ltr" className="input text-end" placeholder="Faculty of Engineering & IT" />
              </div>
              <button className="btn btn-gold w-full"><Plus size={15} /> إضافة الكلية</button>
            </form>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-display text-[0.98rem] font-semibold text-white">إضافة قسم أكاديمي</h3>
            <form action={createDepartmentAction} className="mt-4 space-y-3.5">
              <div>
                <label className="label">الكلية التابع لها *</label>
                <select name="collegeId" required className="input" defaultValue="">
                  <option value="" disabled>اختر الكلية</option>
                  {uniColleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">اسم القسم *</label>
                <input name="name" required className="input" placeholder="قسم هندسة البرمجيات" />
              </div>
              <div>
                <label className="label">الاسم بالإنجليزية</label>
                <input name="nameEn" dir="ltr" className="input text-end" placeholder="Software Engineering" />
              </div>
              <button className="btn btn-gold w-full" disabled={uniColleges.length === 0}>
                <Plus size={15} /> إضافة القسم
              </button>
            </form>
          </div>

          <div className="card-surface p-5 text-[0.78rem] leading-7 text-mist-400">
            <span className="font-semibold text-gold-300">ملاحظة:</span> الفرق الدراسية ثابتة من الأولى إلى الخامسة
            وتُسند للطلاب من صفحة إدارة الطلاب أو عبر الاستيراد.
          </div>
        </div>
      </div>
    </div>
  );
}
