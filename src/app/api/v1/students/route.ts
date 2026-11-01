import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { colleges, departments, students, syncLogs, universities } from "@/db/schema";
import { generateTempPassword, hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Authenticate the calling university via x-api-key / x-api-secret headers. */
async function authenticate(req: NextRequest) {
  const { ensureDb } = await import("@/lib/bootstrap");
  await ensureDb();
  const apiKey = req.headers.get("x-api-key") ?? "";
  const apiSecret = req.headers.get("x-api-secret") ?? "";
  if (!apiKey || !apiSecret) return null;

  const [uni] = await db.select().from(universities).where(eq(universities.apiKey, apiKey)).limit(1);
  if (!uni || uni.status !== "approved" || !uni.apiSecretHash) return null;
  if (!verifyPassword(apiSecret, uni.apiSecretHash)) return null;
  return uni;
}

async function log(universityId: string, action: string, records: number, status: "success" | "partial" | "failed", message?: string) {
  await db.insert(syncLogs).values({ universityId, type: "api", action, recordsCount: records, status, message });
}

/* ------------------------------ GET: pull roster ----------------------------- */

export async function GET(req: NextRequest) {
  const uni = await authenticate(req);
  if (!uni) {
    return NextResponse.json({ error: "unauthorized", message: "Invalid or missing API credentials." }, { status: 401 });
  }

  const rows = await db
    .select({
      studentNumber: students.studentNumber,
      fullName: students.fullName,
      email: students.email,
      nationalId: students.nationalId,
      level: students.level,
      gpa: students.gpa,
      status: students.status,
      college: colleges.name,
      department: departments.name,
      updatedAt: students.updatedAt,
    })
    .from(students)
    .leftJoin(colleges, eq(students.collegeId, colleges.id))
    .leftJoin(departments, eq(students.departmentId, departments.id))
    .where(eq(students.universityId, uni.id))
    .limit(5000);

  await log(uni.id, "سحب بيانات الطلاب عبر API", rows.length, "success");

  return NextResponse.json({
    university: uni.code,
    count: rows.length,
    generatedAt: new Date().toISOString(),
    students: rows,
  });
}

/* --------------------------- POST: upsert roster ----------------------------- */

type IncomingRow = {
  studentNumber?: string;
  fullName?: string;
  email?: string;
  nationalId?: string;
  college?: string;
  department?: string;
  level?: number;
  gpa?: number;
};

export async function POST(req: NextRequest) {
  const uni = await authenticate(req);
  if (!uni) {
    return NextResponse.json({ error: "unauthorized", message: "Invalid or missing API credentials." }, { status: 401 });
  }

  let body: { students?: IncomingRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Body must be JSON: { students: [...] }" }, { status: 400 });
  }

  const rows = Array.isArray(body.students) ? body.students.slice(0, 2000) : [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "bad_request", message: "Provide a non-empty students array." }, { status: 400 });
  }

  const [uniColleges, uniDepartments] = await Promise.all([
    db.select().from(colleges).where(eq(colleges.universityId, uni.id)),
    db.select().from(departments).where(eq(departments.universityId, uni.id)),
  ]);

  let created = 0;
  let updated = 0;
  const errors: string[] = [];
  const credentials: { studentNumber: string; password: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const studentNumber = (r.studentNumber ?? "").toString().trim();
    const fullName = (r.fullName ?? "").toString().trim();
    if (!studentNumber || !fullName) {
      errors.push(`row ${i + 1}: studentNumber and fullName are required`);
      continue;
    }

    const college = uniColleges.find((c) => c.name === (r.college ?? "").toString().trim());
    const department = uniDepartments.find((d) => d.name === (r.department ?? "").toString().trim());
    const level = Math.min(5, Math.max(1, Number(r.level) || 1));
    const gpa = Math.min(4, Math.max(0, Number(r.gpa) || 0)).toFixed(2);

    try {
      const [existing] = await db
        .select()
        .from(students)
        .where(and(eq(students.universityId, uni.id), eq(students.studentNumber, studentNumber)))
        .limit(1);

      if (existing) {
        await db
          .update(students)
          .set({
            fullName,
            email: (r.email ?? "").toString().trim().toLowerCase() || null,
            nationalId: (r.nationalId ?? "").toString().trim() || existing.nationalId,
            collegeId: college?.id ?? existing.collegeId,
            departmentId: department?.id ?? existing.departmentId,
            level,
            gpa,
            updatedAt: new Date(),
          })
          .where(eq(students.id, existing.id));
        updated++;
      } else {
        const plain = generateTempPassword();
        await db.insert(students).values({
          universityId: uni.id,
          studentNumber,
          fullName,
          email: (r.email ?? "").toString().trim().toLowerCase() || null,
          nationalId: (r.nationalId ?? "").toString().trim() || null,
          collegeId: college?.id ?? null,
          departmentId: department?.id ?? null,
          level,
          gpa,
          passwordHash: hashPassword(plain),
          enrolledYear: new Date().getFullYear(),
        });
        created++;
        credentials.push({ studentNumber, password: plain });
      }
    } catch {
      errors.push(`row ${i + 1}: failed to save`);
    }
  }

  await log(
    uni.id,
    "مزامنة سجلات الطلاب عبر API",
    created + updated,
    errors.length > 0 ? "partial" : "success",
    `created=${created} updated=${updated} failed=${errors.length}`
  );

  return NextResponse.json({ university: uni.code, created, updated, failed: errors.length, errors, credentials });
}
