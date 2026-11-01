import { requirePlatformAdmin } from "@/lib/auth";
import { db } from "@/db";
import { joinRequests } from "@/db/schema";
import { desc, eq, inArray, count } from "drizzle-orm";
import { CheckCircle2, Clock3, Inbox, XCircle } from "lucide-react";
import { PageHeader } from "@/components/dash/shell";
import { RequestsManager } from "@/components/dash/requests-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "طلبات الانضمام" };

export default async function RequestsPage() {
  await requirePlatformAdmin();

  const [rows, [pending], [approved], [rejected]] = await Promise.all([
    db.select().from(joinRequests).orderBy(desc(joinRequests.createdAt)),
    db.select({ v: count() }).from(joinRequests).where(eq(joinRequests.status, "pending")),
    db.select({ v: count() }).from(joinRequests).where(eq(joinRequests.status, "approved")),
    db.select({ v: count() }).from(joinRequests).where(inArray(joinRequests.status, ["rejected"])),
  ]);

  return (
    <div>
      <PageHeader title="طلبات انضمام الجامعات" subtitle="مراجعة بيانات ومستندات الجامعات المتقدمة واعتمادها أو رفضها">
        <span className="chip chip-gold"><Clock3 size={13} /> {pending.v} معلق</span>
        <span className="chip chip-green"><CheckCircle2 size={13} /> {approved.v} معتمد</span>
        <span className="chip chip-red"><XCircle size={13} /> {rejected.v} مرفوض</span>
      </PageHeader>

      {rows.length === 0 ? (
        <div className="card-surface p-14 text-center">
          <Inbox size={36} className="mx-auto text-mist-500" />
          <p className="mt-4 text-[0.9rem] text-mist-400">لا توجد طلبات انضمام حتى الآن.</p>
        </div>
      ) : (
        <RequestsManager requests={rows} />
      )}
    </div>
  );
}
