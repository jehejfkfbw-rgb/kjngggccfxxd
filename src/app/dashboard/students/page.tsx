import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { colleges, departments, students } from "@/db/schema";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { PageHeader } from "@/components/dash/shell";
import { StudentsManager } from "@/components/dash/students-manager";
import { FileSpreadsheet, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة الطلاب" };

const PAGE_SIZE = 12;

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; college?: string; level?: string }>;
}) {
  const { university } = await requireUniversityAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const collegeFilter = params.college ?? "";
  const levelParam = params.level ?? "";
  const levelFilter = parseInt(levelParam) || null;

  const conditions = [eq(students.universityId, university.id)];
  if (q) {
    conditions.push(or(ilike(students.fullName, `%${q}%`), ilike(students.studentNumber, `%${q}%`), ilike(students.email, `%${q}%`))!);
  }
  if (collegeFilter) conditions.push(eq(students.collegeId, collegeFilter));
  if (levelFilter) conditions.push(eq(students.level, levelFilter));

  const where = and(...conditions);

  const [[totalRow], rows, uniColleges, uniDepartments] = await Promise.all([
    db.select({ v: count() }).from(students).where(where),
    db
      .select()
      .from(students)
      .where(where)
      .orderBy(desc(students.updatedAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select().from(colleges).where(eq(colleges.universityId, university.id)).orderBy(asc(colleges.name)),
    db.select().from(departments).where(eq(departments.universityId, university.id)).orderBy(asc(departments.name)),
  ]);

  const total = totalRow.v;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader title="إدارة الطلاب" subtitle="إضافة وتحديث ومراجعة بيانات طلاب جامعتك — تنعكس التعديلات فوراً على بواباتهم">
        <span className="chip chip-blue"><Users size={13} /> <span className="tnum" dir="ltr">{total.toLocaleString("en-US")}</span> طالب</span>
        <Link href="/dashboard/import" className="btn btn-ghost !py-2.5">
          <FileSpreadsheet size={15} /> استيراد ملف
        </Link>
      </PageHeader>

      <StudentsManager
        students={rows}
        colleges={uniColleges}
        departments={uniDepartments.map((d) => ({ ...d }))}
        q={q}
        page={page}
        totalPages={totalPages}
        collegeFilter={collegeFilter}
        levelFilter={levelParam}
      />
    </div>
  );
}
