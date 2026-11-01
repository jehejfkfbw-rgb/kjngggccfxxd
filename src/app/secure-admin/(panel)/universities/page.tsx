import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { students, universities } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Ban, CheckCircle2, Globe2, GraduationCap, Landmark, Mail } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { setUniversityStatusAction } from "@/lib/actions/admin";
import { formatDateAr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "الجامعات المشاركة" };

export default async function AdminUniversitiesPage() {
  await requirePlatformAdmin();

  const [unis, studentCounts] = await Promise.all([
    db.select().from(universities).orderBy(desc(universities.createdAt)),
    db.select({ universityId: students.universityId, v: count() }).from(students).groupBy(students.universityId),
  ]);

  return (
    <div>
      <PageHeader title="الجامعات المشاركة" subtitle="دليل الجامعات المعتمدة على المنصة وإدارة حالة كل منها">
        <span className="chip chip-gold"><Landmark size={13} /> {unis.length} جامعة</span>
      </PageHeader>

      <div className="grid gap-4">
        {unis.length === 0 && (
          <div className="card-surface p-14 text-center text-[0.9rem] text-mist-400">لم تُعتمد أي جامعة بعد.</div>
        )}
        {unis.map((u) => {
          const countRow = studentCounts.find((s) => s.universityId === u.id);
          const suspended = u.status === "suspended";
          return (
            <div key={u.id} className="card-surface card-hover p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl p-3 font-display text-sm font-bold text-white"
                    style={{ background: `linear-gradient(140deg, ${u.logoColor}, ${u.logoColor}44)` }}
                  >
                    {u.code.slice(0, 2)}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-[1.05rem] font-semibold text-white">{u.name}</h3>
                      <span className="chip chip-gray font-mono" dir="ltr">{u.code}</span>
                      {u.ssoType === "google" && <span className="chip chip-blue">Google SSO</span>}
                      {suspended ? (
                        <span className="chip chip-red"><Ban size={11} /> موقوفة</span>
                      ) : (
                        <span className="chip chip-green"><CheckCircle2 size={11} /> نشطة</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.74rem] text-mist-400">
                      <span>{[u.city, u.country].filter(Boolean).join(" · ")}</span>
                      {u.contactEmail && <span className="flex items-center gap-1.5" dir="ltr"><Mail size={11} /> {u.contactEmail}</span>}
                      {u.website && <span className="flex items-center gap-1.5" dir="ltr"><Globe2 size={11} /> {u.website}</span>}
                      <span className="flex items-center gap-1.5"><GraduationCap size={12} /> {countRow?.v ?? 0} طالب على المنصة</span>
                    </div>
                  </div>
                </div>

                <form action={setUniversityStatusAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="status" value={suspended ? "approved" : "suspended"} />
                  <button className={suspended ? "btn btn-ghost !py-2.5" : "btn btn-danger !py-2.5"}>
                    {suspended ? "إعادة التفعيل" : "إيقاف مؤقت"}
                  </button>
                </form>
              </div>
              <p className="mt-3 text-[0.7rem] text-mist-600">انضمت بتاريخ {formatDateAr(u.createdAt)} · آخر مزامنة تظهر في سجل الجامعة الخاص</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
