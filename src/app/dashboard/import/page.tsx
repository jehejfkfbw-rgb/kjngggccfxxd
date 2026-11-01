import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { colleges, departments } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/dash/shell";
import { ImportClient } from "@/components/dash/import-client";
import { FileSpreadsheet } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "استيراد البيانات" };

export default async function ImportPage() {
  const { university } = await requireUniversityAdmin();

  const [uniColleges, uniDepartments] = await Promise.all([
    db.select().from(colleges).where(eq(colleges.universityId, university.id)).orderBy(asc(colleges.name)),
    db.select().from(departments).where(eq(departments.universityId, university.id)).orderBy(asc(departments.name)),
  ]);

  return (
    <div>
      <PageHeader
        title="استيراد بيانات الطلاب"
        subtitle="ارفع ملف Excel أو CSV وسيتم إنشاء وتحديث السجلات تلقائياً مع توليد بيانات الدخول"
      >
        <span className="chip chip-gold"><FileSpreadsheet size={13} /> Excel · CSV</span>
      </PageHeader>

      <ImportClient
        colleges={uniColleges.map((c) => c.name)}
        departments={uniDepartments.map((d) => d.name)}
      />
    </div>
  );
}
