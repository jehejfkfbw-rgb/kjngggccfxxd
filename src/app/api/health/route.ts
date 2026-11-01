import { pool } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pool.query("select 1");

    try {
      const { ensureDb } = await import("@/lib/bootstrap");
      await ensureDb();
      const { rows } = await pool.query(
        `SELECT
           (SELECT count(*)::int FROM platform_admins) AS admins,
           (SELECT count(*)::int FROM universities)     AS universities,
           (SELECT count(*)::int FROM students)         AS students`
      );
      const counts = rows[0] ?? { admins: 0, universities: 0, students: 0 };
      return Response.json({
        ok: true,
        schemaReady: true,
        adminAccountReady: counts.admins > 0,
        counts,
      });
    } catch {
      // Connected to DB but schema/bootstrap not done yet
      return Response.json({ ok: true, schemaReady: false, adminAccountReady: false });
    }
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
