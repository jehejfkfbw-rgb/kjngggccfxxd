import { db } from "@/db";
import { universities } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { AuthShell } from "@/components/auth/shell";
import { StudentLoginForm } from "@/components/auth/student-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "دخول الطلاب" };
export const dynamic = "force-dynamic";

export default async function StudentLoginPage() {
  const unis = await db
    .select({ code: universities.code, name: universities.name, ssoType: universities.ssoType, googleDomain: universities.googleDomain })
    .from(universities)
    .where(eq(universities.status, "approved"))
    .orderBy(asc(universities.name));

  return (
    <AuthShell
      title="بوابة الطالب"
      subtitle="سجّل دخولك ببياناتك الجامعية المعتمدة للوصول إلى ملفك الأكاديمي ونتائجك وجدولك الدراسي."
      asideTitle="بياناتك الأكاديمية الرسمية، محدثة لحظياً من جامعتك"
      asideSubtitle="منصة Academic Future تعرض بيانات الطلاب كما ترسلها الجامعة مباشرة — لا تعديل ذاتي ولا حسابات غير موثقة."
      asidePoints={[
        "عرض الكلية والقسم والفرقة الدراسية والمعدل التراكمي",
        "المواد والجداول والنتائج والإعلانات الجامعية",
        "تحديث فوري عند أي تعديل من إدارة الجامعة",
      ]}
      image="/images/hero-campus.jpg"
    >
      {unis.length > 0 ? (
        <StudentLoginForm universities={unis} />
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-mist-300">
          لا توجد جامعات مفعّلة حالياً. يرجى المحاولة لاحقاً.
        </p>
      )}
    </AuthShell>
  );
}
