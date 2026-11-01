import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { students, universities } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Ban, CheckCircle2, Globe2, GraduationCap, Landmark, Mail, Building2 } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { setUniversityStatusAction } from "@/lib/actions/admin";
import { formatDateAr } from "@/lib/utils";
import { UniEditor } from "@/components/dash/uni-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة الجامعات المركزية" };

export default async function AdminUniversitiesPage() {
  await requirePlatformAdmin();

  const [unis, studentCounts] = await Promise.all([
    db.select().from(universities).orderBy(desc(universities.createdAt)),
    db.select({ universityId: students.universityId, v: count() }).from(students).groupBy(students.universityId),
  ]);

  return (
    <div>
      <PageHeader title="إدارة الجامعات المركزية" subtitle="دليل الكيانات المعتمدة والتحكم الكامل في إعداداتها وحالتها">
        <span className="chip chip-teal"><Landmark size={13} /> {unis.length} جامعة مدمجة</span>
      </PageHeader>

      <div className="grid gap-4">
        {unis.length === 0 && (
          <div className="card-surface p-14 text-center text-slate-500">لا توجد جامعات مسجلة في المنصة بعد.</div>
        )}
        {unis.map((u) => {
          const countRow = studentCounts.find((s) => s.universityId === u.id);
          const suspended = u.status === "suspended";
          return (
            <div key={u.id} className="card-surface card-hover p-6 border-l-4" style={{ borderLeftColor: u.logoColor ?? "#4fd1c5" }}>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl p-3 font-display text-base font-bold text-white shadow-lg"
                    style={{ background: `linear-gradient(140deg, ${u.logoColor ?? "#4fd1c5"}, ${u.logoColor ?? "#4fd1c5"}55)` }}
                  >
                    {u.code.slice(0, 2)}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-[1.1rem] font-bold text-white">{u.name}</h3>
                      <span className="chip chip-gray font-mono text-[0.65rem]" dir="ltr">{u.code}</span>
                      {suspended ? (
                        <span className="chip chip-red !py-0.5"><Ban size={11} /> موقوفة</span>
                      ) : (
                        <span className="chip chip-green !py-0.5"><CheckCircle2 size={11} /> نشطة</span>
                      )}
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.76rem] text-slate-400">
                      <span className="flex items-center gap-1.5"><Building2 size={13} className="text-slate-500" /> {[u.city, u.country].filter(Boolean).join(" · ")}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-slate-500" /> {countRow?.v ?? 0} طالب</span>
                      <span className="flex items-center gap-1.5" dir="ltr"><Mail size={13} className="text-slate-500" /> {u.contactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UniEditor uni={u} />
                  
                  <form action={setUniversityStatusAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="status" value={suspended ? "approved" : "suspended"} />
                    <button className={suspended ? "btn btn-primary !py-2 !px-4 !text-xs" : "btn btn-danger !py-2 !px-4 !text-xs"}>
                      {suspended ? "إعادة تفعيل" : "إيقاف مؤقت"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
