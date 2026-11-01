import { requireUniversityAdmin } from "@/lib/auth";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Bell, Megaphone, Pin, Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { createAnnouncementAction, deleteAnnouncementAction } from "@/lib/actions/university";
import { LEVELS_AR, formatDateTimeAr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "الإعلانات" };

export default async function AnnouncementsPage() {
  const { university } = await requireUniversityAdmin();

  const rows = await db
    .select()
    .from(announcements)
    .where(eq(announcements.universityId, university.id))
    .orderBy(desc(announcements.pinned), desc(announcements.createdAt));

  return (
    <div>
      <PageHeader title="إعلانات الجامعة" subtitle="انشر الإعلانات الرسمية لتظهر فوراً في بوابات طلابك">
        <span className="chip chip-blue"><Bell size={13} /> {rows.length} إعلان منشور</span>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Create form */}
        <div className="card-surface h-fit p-6">
          <h3 className="flex items-center gap-2.5 font-display text-[1rem] font-semibold text-white">
            <Megaphone size={18} className="text-gold-400" />
            نشر إعلان جديد
          </h3>
          <form action={createAnnouncementAction} className="mt-5 space-y-4">
            <div>
              <label className="label">عنوان الإعلان *</label>
              <input name="title" required className="input" placeholder="بدء التسجيل للفصل الدراسي الثاني" />
            </div>
            <div>
              <label className="label">نص الإعلان *</label>
              <textarea name="body" required rows={5} className="input resize-none" placeholder="تفاصيل الإعلان..." />
            </div>
            <div>
              <label className="label">الجمهور المستهدف</label>
              <select name="level" className="input" defaultValue="">
                <option value="">جميع الفرق</option>
                {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>{LEVELS_AR[l]}</option>)}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <input type="checkbox" name="pinned" className="h-4 w-4 accent-[#d9ac45]" />
              <span className="flex items-center gap-2 text-[0.82rem] text-mist-200"><Pin size={14} className="text-gold-400" /> تثبيت الإعلان أعلى القائمة</span>
            </label>
            <button className="btn btn-gold w-full"><Send size={15} /> نشر الإعلان</button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          {rows.length === 0 && (
            <div className="card-surface p-12 text-center">
              <Bell size={34} className="mx-auto text-mist-500" />
              <p className="mt-3 text-[0.88rem] text-mist-400">لا توجد إعلانات منشورة — أنشئ أول إعلان من النموذج.</p>
            </div>
          )}
          {rows.map((a) => (
            <article key={a.id} className={`card-surface p-6 ${a.pinned ? "ring-gold" : ""}`}>
              <div className="flex items-center gap-2">
                {a.pinned && <span className="chip chip-gold !px-2.5 !py-0.5 !text-[0.66rem]"><Pin size={11} /> مثبت</span>}
                {a.level ? (
                  <span className="chip chip-blue !px-2.5 !py-0.5 !text-[0.66rem]">{LEVELS_AR[a.level]}</span>
                ) : (
                  <span className="chip chip-gray !px-2.5 !py-0.5 !text-[0.66rem]">جميع الفرق</span>
                )}
                <span className="ms-auto text-[0.7rem] text-mist-500">{formatDateTimeAr(a.createdAt)}</span>
                <form action={deleteAnnouncementAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <button title="حذف" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-rose-400/40 hover:text-rose-300">
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
              <h3 className="mt-3 font-display text-[1.02rem] font-semibold text-white">{a.title}</h3>
              <p className="mt-2 whitespace-pre-line text-[0.84rem] leading-7 text-mist-300">{a.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
