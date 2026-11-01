import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { students, universities } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { PageHeader } from "@/components/dash/shell";
import { Search, Trash2, Globe, Building2, UserCircle } from "lucide-react";
import { LEVELS_AR, formatDateAr, initials } from "@/lib/utils";
import { adminDeleteStudentAction } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة الطلاب الشاملة" };

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePlatformAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").trim();

  let conditions = [];
  if (q) {
    conditions.push(
      or(
        ilike(students.fullName, `%${q}%`),
        ilike(students.studentNumber, `%${q}%`),
        ilike(students.email, `%${q}%`)
      )
    );
  }

  const rows = await db
    .select({
      student: students,
      uni: universities,
    })
    .from(students)
    .innerJoin(universities, eq(students.universityId, universities.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(students.createdAt))
    .limit(50);

  return (
    <div className="space-y-6">
      <PageHeader title="البحث الشامل عن الطلاب" subtitle="إدارة أي طالب في أي جامعة مشاركة على مستوى المنصة">
        <span className="chip chip-coral"><Globe size={13} /> بحث حي في كل السجلات</span>
      </PageHeader>

      {/* Search Bar */}
      <div className="card-surface p-4">
        <form className="relative flex-1">
          <Search size={18} className="absolute inset-y-0 start-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="ابحث بالاسم، الرقم الجامعي، أو البريد في جميع الجامعات..."
            className="input !ps-12 !py-3 !text-[0.95rem]"
          />
        </form>
      </div>

      {/* Results Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl min-w-[900px]">
            <thead>
              <tr>
                <th>الطالب</th>
                <th>الجامعة</th>
                <th>البيانات الأكاديمية</th>
                <th>تاريخ التسجيل</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500">
                    <UserCircle size={40} className="mx-auto mb-3 opacity-20" />
                    {q ? "لم يتم العثور على نتائج للبحث." : "اكتب اسماً أو رقماً للبدء في البحث عبر المنصة."}
                  </td>
                </tr>
              )}
              {rows.map(({ student: s, uni: u }) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-space-800 font-display text-xs font-bold text-teal-400">
                        {initials(s.fullName)}
                      </span>
                      <div>
                        <p className="font-bold text-white leading-tight">{s.fullName}</p>
                        <p className="text-[0.7rem] text-slate-500 mt-0.5" dir="ltr">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                       <span className="chip chip-gray !px-2 !py-0.5 font-mono text-[0.65rem]">{u.code}</span>
                       <p className="text-[0.8rem] font-medium text-slate-300">{u.name}</p>
                    </div>
                  </td>
                  <td>
                    <p className="text-[0.8rem] text-white">الرقم: <span className="font-mono text-teal-400">{s.studentNumber}</span></p>
                    <p className="text-[0.7rem] text-slate-500 mt-0.5">{LEVELS_AR[s.level]} · GPA {s.gpa}</p>
                  </td>
                  <td className="text-[0.75rem] text-slate-400">{formatDateAr(s.createdAt)}</td>
                  <td>
                    <form action={adminDeleteStudentAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="btn btn-danger !p-2 rounded-lg hover:!bg-red-500/20" title="حذف الطالب من المنصة">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
