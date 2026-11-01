import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { and, desc, eq, or, isNull } from "drizzle-orm";
import { Bell, Pin } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { LEVELS_AR, formatDateTimeAr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "الإعلانات" };

export default async function AnnouncementsPage() {
  const { user: student, university } = await requireStudent();

  const rows = await db
    .select()
    .from(announcements)
    .where(and(eq(announcements.universityId, university.id), or(isNull(announcements.level), eq(announcements.level, student.level))))
    .orderBy(desc(announcements.pinned), desc(announcements.createdAt));

  return (
    <div>
      <PageHeader title="إعلانات الجامعة" subtitle="الإعلانات الرسمية الموجهة إليك من إدارة الجامعة">
        <span className="chip chip-blue"><Bell size={13} /> {rows.length} إعلان</span>
      </PageHeader>

      {rows.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <Bell size={36} className="mx-auto text-mist-500" />
          <p className="mt-4 text-[0.9rem] text-mist-400">لا توجد إعلانات منشورة حالياً.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((a) => (
            <article key={a.id} className={`card-surface p-6 ${a.pinned ? "ring-gold" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                {a.pinned && (
                  <span className="chip chip-gold !px-2.5 !py-0.5 !text-[0.66rem]"><Pin size={11} /> مثبت</span>
                )}
                {a.level ? (
                  <span className="chip chip-blue !px-2.5 !py-0.5 !text-[0.66rem]">{LEVELS_AR[a.level]}</span>
                ) : (
                  <span className="chip chip-gray !px-2.5 !py-0.5 !text-[0.66rem]">إعلان عام</span>
                )}
                <span className="ms-auto text-[0.7rem] text-mist-500">{formatDateTimeAr(a.createdAt)}</span>
              </div>
              <h2 className="mt-3.5 font-display text-[1.1rem] font-semibold text-white">{a.title}</h2>
              <p className="mt-2.5 whitespace-pre-line text-[0.87rem] leading-8 text-mist-300">{a.body}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
