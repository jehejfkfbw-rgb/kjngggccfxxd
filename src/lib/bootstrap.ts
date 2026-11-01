import { pool } from "@/db";
import { SCHEMA_SQL } from "@/db/ddl";

/**
 * Ensures the database schema exists and contains seed data.
 * - Runs exactly once per server instance (cached promise).
 * - Fully idempotent: safe on an existing database and on every redeploy.
 * - Runs automatically at server start (src/instrumentation.ts) and lazily
 *   before first public queries, so no manual terminal step is ever needed.
 */
let ready: Promise<{ seeded: boolean }> | null = null;

export function ensureDb(): Promise<{ seeded: boolean }> {
  if (!ready) {
    ready = bootstrap().catch((err) => {
      // Reset so the next request can retry instead of caching a failure.
      ready = null;
      throw err;
    });
  }
  return ready;
}

async function bootstrap(): Promise<{ seeded: boolean }> {
  // 1) Create enums/tables/indexes (idempotent).
  await pool.query(SCHEMA_SQL);

  // 2) Seed only when the database is completely fresh.
  const { rows } = await pool.query<{ count: string }>(
    'SELECT count(*)::text AS count FROM "platform_admins"'
  );
  const hasData = Number(rows[0]?.count ?? "0") > 0;
  if (hasData) {
    console.log("[bootstrap] schema OK — data already present, skipping seed");
    return { seeded: false };
  }

  const { seedDatabase } = await import("@/db/seed");
  await seedDatabase();
  console.log("[bootstrap] schema created and seed data inserted");
  return { seeded: true };
}
