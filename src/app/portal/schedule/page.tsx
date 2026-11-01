import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import { courses, courseSchedules, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { CalendarDays, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { DAYS_AR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "الجدول الأسبوعي" };

const START = 8 * 60; // 08:00
const END = 18 * 60; // 18:00
const SPAN = END - START;

const palette = [
  "border-azure-400/30 bg-azure-400/10 text-azure-200",
  "border-gold-500/30 bg-gold-400/10 text-gold-200",
  "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  "border-rose-400/30 bg-rose-400/10 text-rose-200",
  "border-violet-400/30 bg-violet-400/10 text-violet-200",
  "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
];

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default async function SchedulePage() {
  const { user: student, university } = await requireStudent();

  const rows = await db
    .select({ schedule: courseSchedules, course: courses })
    .from(courseSchedules)
    .innerJoin(courses, eq(courseSchedules.courseId, courses.id))
    .innerJoin(
      enrollments,
      and(eq(enrollments.courseId, courses.id), eq(enrollments.studentId, student.id))
    )
    .where(and(eq(courseSchedules.universityId, university.id), eq(enrollments.status, "enrolled")));

  const byDay: Record<number, typeof rows> = {};
  rows.forEach((r) => {
    byDay[r.schedule.dayOfWeek] = [...(byDay[r.schedule.dayOfWeek] ?? []), r];
  });

  const courseColor = new Map<string, number>();
  let ci = 0;
  rows.forEach((r) => {
    if (!courseColor.has(r.course.id)) courseColor.set(r.course.id, ci++ % palette.length);
  });

  const todayJs = new Date().getDay(); // 0 = Sunday in JS too

  return (
    <div>
      <PageHeader title="الجدول الأسبوعي" subtitle="محاضرات موادك المسجلة للفصل الدراسي الحالي">
        <span className="chip chip-gold"><CalendarDays size={13} /> {rows.length} محاضرة أسبوعياً</span>
      </PageHeader>

      {rows.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <CalendarDays size={36} className="mx-auto text-mist-500" />
          <p className="mt-4 text-[0.9rem] text-mist-400">لم تنشر جامعتك مواعيد المحاضرات بعد — سيظهر الجدول هنا فور اعتماده.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden p-4 md:p-6">
          <div className="grid grid-cols-7 gap-2" style={{ direction: "rtl" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const isToday = day === todayJs;
              return (
                <div key={day} className="flex min-w-0 flex-col">
                  <div
                    className={`rounded-xl py-2 text-center text-[0.72rem] font-semibold ${
                      isToday ? "bg-gold-400/15 text-gold-300" : "bg-white/[0.03] text-mist-400"
                    }`}
                  >
                    {DAYS_AR[day]}
                  </div>
                  <div className="relative mt-2 h-[560px] rounded-xl border border-white/5 bg-white/[0.015]">
                    {/* hour lines */}
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
                      <div key={h} className="absolute inset-x-0 border-t border-white/[0.045]" style={{ top: `${((h * 60 - START) / SPAN) * 100}%` }} />
                    ))}
                    {(byDay[day] ?? []).map((r) => {
                      const top = Math.max(0, ((toMin(r.schedule.startTime) - START) / SPAN) * 100);
                      const height = Math.min(100 - top, ((toMin(r.schedule.endTime) - toMin(r.schedule.startTime)) / SPAN) * 100);
                      const cls = palette[courseColor.get(r.course.id) ?? 0];
                      return (
                        <div
                          key={r.schedule.id}
                          className={`absolute inset-x-1 overflow-hidden rounded-lg border px-1.5 py-1 md:px-2 ${cls}`}
                          style={{ top: `${top}%`, height: `${height}%` }}
                        >
                          <p className="truncate font-mono text-[0.55rem] font-bold md:text-[0.62rem]" dir="ltr">
                            {r.schedule.startTime}–{r.schedule.endTime}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[0.6rem] font-semibold leading-4 md:text-[0.66rem]">{r.course.name}</p>
                          {height > 12 && (
                            <p className="mt-0.5 hidden items-center gap-1 text-[0.55rem] opacity-70 md:flex">
                              <MapPin size={8} />
                              <span className="truncate">{r.schedule.location}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-[0.68rem] text-mist-500" dir="ltr">
            <span>08:00</span><span>12:00</span><span>18:00</span>
          </div>
        </div>
      )}
    </div>
  );
}
