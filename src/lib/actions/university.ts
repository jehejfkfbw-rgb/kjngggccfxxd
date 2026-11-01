"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements,
  colleges,
  courses,
  departments,
  students,
  syncLogs,
  universities,
} from "@/db/schema";
import {
  generateApiKey,
  generateTempPassword,
  hashPassword,
  requireUniversityAdmin,
} from "@/lib/auth";

function str(v: FormDataEntryValue | null | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

async function logSync(
  universityId: string,
  type: "manual" | "csv_import" | "api",
  action: string,
  recordsCount: number,
  status: "success" | "partial" | "failed",
  message?: string
) {
  await db.insert(syncLogs).values({ universityId, type, action, recordsCount, status, message });
}

export type ActionResult = { ok?: boolean; error?: string; success?: string } | null;

/* --------------------------------- Students -------------------------------- */

export async function saveStudentAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  const studentNumber = str(formData.get("studentNumber"));
  const fullName = str(formData.get("fullName"));
  const email = str(formData.get("email")).toLowerCase() || null;
  const nationalId = str(formData.get("nationalId")) || null;
  const collegeId = str(formData.get("collegeId")) || null;
  const departmentId = str(formData.get("departmentId")) || null;
  const level = Math.min(5, Math.max(1, parseInt(str(formData.get("level"))) || 1));
  const status = (["active", "suspended", "graduated"] as const).includes(
    str(formData.get("status")) as never
  )
    ? (str(formData.get("status")) as "active" | "suspended" | "graduated")
    : "active";
  const password = str(formData.get("password"));

  if (!studentNumber || !fullName) return;

  if (id) {
    await db
      .update(students)
      .set({
        studentNumber,
        fullName,
        email,
        nationalId,
        collegeId,
        departmentId,
        level,
        status,
        updatedAt: new Date(),
        ...(password ? { passwordHash: hashPassword(password) } : {}),
      })
      .where(and(eq(students.id, id), eq(students.universityId, university.id)));
    await logSync(university.id, "manual", "تحديث بيانات طالب", 1, "success", `الطالب ${fullName}`);
  } else {
    const passwordHash = hashPassword(password || studentNumber);
    await db.insert(students).values({
      universityId: university.id,
      studentNumber,
      fullName,
      email,
      nationalId,
      collegeId,
      departmentId,
      level,
      status,
      passwordHash,
      enrolledYear: new Date().getFullYear(),
    });
    await logSync(university.id, "manual", "إضافة طالب جديد", 1, "success", `الطالب ${fullName}`);
  }
  revalidatePath("/dashboard/students");
}

export async function deleteStudentAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  await db.delete(students).where(and(eq(students.id, id), eq(students.universityId, university.id)));
  await logSync(university.id, "manual", "حذف طالب", 1, "success");
  revalidatePath("/dashboard/students");
}

/* ------------------------------ Import students ---------------------------- */

export type ImportRow = {
  studentNumber?: string;
  fullName?: string;
  email?: string;
  nationalId?: string;
  college?: string;
  department?: string;
  level?: string | number;
  gpa?: string | number;
  password?: string;
};

export type ImportResult = {
  created: number;
  updated: number;
  failed: number;
  errors: string[];
  credentials: { studentNumber: string; fullName: string; password: string }[];
};

export async function importStudentsAction(rows: ImportRow[]): Promise<ImportResult> {
  const { university } = await requireUniversityAdmin();
  const result: ImportResult = { created: 0, updated: 0, failed: 0, errors: [], credentials: [] };

  if (!Array.isArray(rows) || rows.length === 0) {
    return { ...result, errors: ["الملف لا يحتوي على أي سجلات."] };
  }
  if (rows.length > 2000) {
    return { ...result, errors: ["الحد الأقصى للاستيراد 2000 سجل في المرة الواحدة."] };
  }

  const uniColleges = await db.select().from(colleges).where(eq(colleges.universityId, university.id));
  const uniDepartments = await db
    .select()
    .from(departments)
    .where(eq(departments.universityId, university.id));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const studentNumber = (row.studentNumber ?? "").toString().trim();
    const fullName = (row.fullName ?? "").toString().trim();
    if (!studentNumber || !fullName) {
      result.failed++;
      result.errors.push(`سطر ${i + 2}: الرقم الجامعي والاسم مطلوبان.`);
      continue;
    }

    const college = uniColleges.find(
      (c) => c.name === (row.college ?? "").toString().trim()
    );
    const department = uniDepartments.find(
      (d) => d.name === (row.department ?? "").toString().trim()
    );
    const level = Math.min(5, Math.max(1, parseInt(String(row.level ?? "1")) || 1));
    const gpaRaw = String(row.gpa ?? "").trim();
    const gpa = gpaRaw ? Math.min(4, Math.max(0, parseFloat(gpaRaw) || 0)).toFixed(2) : "0.00";

    try {
      const [existing] = await db
        .select()
        .from(students)
        .where(and(eq(students.universityId, university.id), eq(students.studentNumber, studentNumber)))
        .limit(1);

      if (existing) {
        const newPassword = (row.password ?? "").toString().trim();
        await db
          .update(students)
          .set({
            fullName,
            email: (row.email ?? "").toString().trim().toLowerCase() || null,
            nationalId: (row.nationalId ?? "").toString().trim() || null,
            collegeId: college?.id ?? existing.collegeId,
            departmentId: department?.id ?? existing.departmentId,
            level,
            gpa,
            updatedAt: new Date(),
            ...(newPassword ? { passwordHash: hashPassword(newPassword) } : {}),
          })
          .where(eq(students.id, existing.id));
        result.updated++;
      } else {
        const plain = (row.password ?? "").toString().trim() || generateTempPassword();
        await db.insert(students).values({
          universityId: university.id,
          studentNumber,
          fullName,
          email: (row.email ?? "").toString().trim().toLowerCase() || null,
          nationalId: (row.nationalId ?? "").toString().trim() || null,
          collegeId: college?.id ?? null,
          departmentId: department?.id ?? null,
          level,
          gpa,
          passwordHash: hashPassword(plain),
          enrolledYear: new Date().getFullYear(),
        });
        result.created++;
        result.credentials.push({ studentNumber, fullName, password: plain });
      }
    } catch {
      result.failed++;
      result.errors.push(`سطر ${i + 2}: تعذر حفظ السجل (تحقق من تكرار الرقم الجامعي).`);
    }
  }

  await logSync(
    university.id,
    "csv_import",
    "استيراد ملف بيانات الطلاب",
    result.created + result.updated,
    result.failed > 0 ? "partial" : "success",
    `تم إنشاء ${result.created} وتحديث ${result.updated} وفشل ${result.failed}`
  );

  revalidatePath("/dashboard/students");
  revalidatePath("/dashboard/integrations");
  return result;
}

/* --------------------------- Colleges & departments ------------------------ */

export async function createCollegeAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const name = str(formData.get("name"));
  const nameEn = str(formData.get("nameEn")) || null;
  if (!name) return;
  await db.insert(colleges).values({ universityId: university.id, name, nameEn });
  revalidatePath("/dashboard/academics");
}

export async function deleteCollegeAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  await db.delete(colleges).where(and(eq(colleges.id, id), eq(colleges.universityId, university.id)));
  revalidatePath("/dashboard/academics");
}

export async function createDepartmentAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const name = str(formData.get("name"));
  const nameEn = str(formData.get("nameEn")) || null;
  const collegeId = str(formData.get("collegeId"));
  if (!name || !collegeId) return;
  await db
    .insert(departments)
    .values({ universityId: university.id, collegeId, name, nameEn });
  revalidatePath("/dashboard/academics");
}

export async function deleteDepartmentAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  await db.delete(departments).where(and(eq(departments.id, id), eq(departments.universityId, university.id)));
  revalidatePath("/dashboard/academics");
}

/* --------------------------------- Courses --------------------------------- */

export async function createCourseAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const code = str(formData.get("code"));
  const name = str(formData.get("name"));
  const instructor = str(formData.get("instructor")) || null;
  const creditHours = Math.min(6, Math.max(1, parseInt(str(formData.get("creditHours"))) || 3));
  const level = Math.min(5, Math.max(1, parseInt(str(formData.get("level"))) || 1));
  const departmentId = str(formData.get("departmentId")) || null;
  if (!code || !name) return;
  await db.insert(courses).values({
    universityId: university.id,
    code: code.toUpperCase(),
    name,
    instructor,
    creditHours,
    level,
    departmentId,
  });
  await logSync(university.id, "manual", "إضافة مادة دراسية", 1, "success", name);
  revalidatePath("/dashboard/courses");
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  await db.delete(courses).where(and(eq(courses.id, id), eq(courses.universityId, university.id)));
  revalidatePath("/dashboard/courses");
}

/* ------------------------------ Announcements ------------------------------ */

export async function createAnnouncementAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const title = str(formData.get("title"));
  const body = str(formData.get("body"));
  const levelRaw = str(formData.get("level"));
  const level = levelRaw ? Math.min(5, Math.max(1, parseInt(levelRaw) || 0)) : null;
  const pinned = formData.get("pinned") === "on";
  if (!title || !body) return;
  await db.insert(announcements).values({ universityId: university.id, title, body, level, pinned });
  revalidatePath("/dashboard/announcements");
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  const { university } = await requireUniversityAdmin();
  const id = str(formData.get("id"));
  if (!id) return;
  await db
    .delete(announcements)
    .where(and(eq(announcements.id, id), eq(announcements.universityId, university.id)));
  revalidatePath("/dashboard/announcements");
}

/* ------------------------------ API credentials ---------------------------- */

export async function regenerateApiCredentialsAction(): Promise<{ apiKey: string; apiSecret: string }> {
  const { university } = await requireUniversityAdmin();
  const apiKey = generateApiKey();
  const apiSecret = generateTempPassword() + generateTempPassword();
  await db
    .update(universities)
    .set({ apiKey, apiSecretHash: hashPassword(apiSecret) })
    .where(eq(universities.id, university.id));
  await logSync(university.id, "api", "إعادة إنشاء بيانات API", 0, "success");
  revalidatePath("/dashboard/integrations");
  return { apiKey, apiSecret };
}
