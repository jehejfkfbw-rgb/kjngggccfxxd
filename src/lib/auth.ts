import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { db } from "@/db";
import {
  sessions,
  students,
  universities,
  universityAdmins,
  platformAdmins,
  type Student,
  type University,
  type UniversityAdmin,
  type PlatformAdmin,
} from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

const SESSION_COOKIE = "af_session";

export const SESSION_TTL: Record<string, number> = {
  student: 1000 * 60 * 60 * 24 * 7, // 7 days
  university_admin: 1000 * 60 * 60 * 24 * 3, // 3 days
  platform_admin: 1000 * 60 * 60 * 8, // 8 hours
};

/* ------------------------------ Password hash ----------------------------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [, salt, hash] = stored.split(":");
    const computed = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return crypto.timingSafeEqual(computed, expected);
  } catch {
    return false;
  }
}

export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateApiKey(): string {
  return `afk_${crypto.randomBytes(24).toString("hex")}`;
}

export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  const buf = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) out += chars[buf[i] % chars.length];
  return out;
}

/* --------------------------------- Sessions ------------------------------- */

export type SessionUser =
  | { role: "student"; user: Student; university: University }
  | { role: "university_admin"; user: UniversityAdmin; university: University }
  | { role: "platform_admin"; user: PlatformAdmin };

export async function createSession(
  role: "student" | "university_admin" | "platform_admin",
  userId: string,
  universityId?: string | null
) {
  const token = generateToken(48);
  const expiresAt = new Date(Date.now() + SESSION_TTL[role]);
  await db.insert(sessions).values({ token, role, userId, universityId: universityId ?? null, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    store.delete(SESSION_COOKIE);
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) return null;

  if (session.role === "student") {
    const [student] = await db.select().from(students).where(eq(students.id, session.userId)).limit(1);
    if (!student || student.status === "suspended") return null;
    const [uni] = await db.select().from(universities).where(eq(universities.id, student.universityId)).limit(1);
    if (!uni || uni.status !== "approved") return null;
    return { role: "student", user: student, university: uni };
  }

  if (session.role === "university_admin") {
    const [admin] = await db
      .select()
      .from(universityAdmins)
      .where(eq(universityAdmins.id, session.userId))
      .limit(1);
    if (!admin) return null;
    const [uni] = await db.select().from(universities).where(eq(universities.id, admin.universityId)).limit(1);
    if (!uni) return null;
    return { role: "university_admin", user: admin, university: uni };
  }

  const [admin] = await db
    .select()
    .from(platformAdmins)
    .where(eq(platformAdmins.id, session.userId))
    .limit(1);
  if (!admin) return null;
  return { role: "platform_admin", user: admin };
}

/* --------------------------------- Guards --------------------------------- */

export async function requireStudent() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login/student");
  return session as Extract<SessionUser, { role: "student" }>;
}

export async function requireUniversityAdmin() {
  const session = await getSession();
  if (!session || session.role !== "university_admin") redirect("/login/university");
  if (session.university.status === "suspended") redirect("/login/university?suspended=1");
  if (session.university.status !== "approved") redirect("/login/university");
  return session as Extract<SessionUser, { role: "university_admin" }>;
}

export async function requirePlatformAdmin() {
  const session = await getSession();
  if (!session || session.role !== "platform_admin") redirect("/secure-admin/login");
  return session as Extract<SessionUser, { role: "platform_admin" }>;
}

/* ------------------------------ Rate limiting ----------------------------- */

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 6, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= max;
}
