import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("DATABASE_URL is required");
}

/** Upgrade SSL to full certificate verification on hosted databases (e.g. Neon). */
function withSecureSsl(url: string): string {
  const local = /(^|[/@.])(localhost|127\.0\.0\.1)([:/]|$)/.test(url);
  if (local) return url;
  let out = url.replace(/sslmode=(prefer|require|verify-ca)(?=&|$)/, "sslmode=verify-full");
  if (!/sslmode=/.test(out)) {
    out += (out.includes("?") ? "&" : "?") + "sslmode=verify-full";
  }
  return out;
}

const connectionString = withSecureSsl(rawUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
