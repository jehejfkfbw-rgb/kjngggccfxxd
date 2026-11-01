"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { joinRequests, universities, universityAdmins, syncLogs } from "@/db/schema";
import {
  generateApiKey,
  generateTempPassword,
  hashPassword,
  requirePlatformAdmin,
} from "@/lib/auth";

function str(v: FormDataEntryValue | null | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

export type ApproveResult = {
  error?: string;
  adminEmail?: string;
  adminPassword?: string;
  universityCode?: string;
} | null;

/* --------------------------- Approve a join request ------------------------ */

export async function approveJoinRequestAction(
  _prev: ApproveResult,
  formData: FormData
): Promise<ApproveResult> {
  await requirePlatformAdmin();

  const requestId = str(formData.get("requestId"));
  const code = str(formData.get("code")).toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
  const ssoType = str(formData.get("ssoType")) === "google" ? "google" : "password";
  const googleDomain = str(formData.get("googleDomain")) || null;

  if (!requestId || !code) return { error: "كود الجامعة مطلوب." };

  const [request] = await db.select().from(joinRequests).where(eq(joinRequests.id, requestId)).limit(1);
  if (!request) return { error: "الطلب غير موجود." };
  if (request.status !== "pending") return { error: "تمت معالجة هذا الطلب مسبقاً." };

  const [existingCode] = await db.select().from(universities).where(eq(universities.code, code)).limit(1);
  if (existingCode) return { error: "كود الجامعة مستخدم بالفعل، اختر كوداً آخر." };

  const adminEmail = request.contactEmail.toLowerCase();
  const [existingAdmin] = await db
    .select()
    .from(universityAdmins)
    .where(eq(universityAdmins.email, adminEmail))
    .limit(1);
  if (existingAdmin) return { error: "البريد الإلكتروني للمسؤول مستخدم بحساب جامعة أخرى." };

  const apiKey = generateApiKey();
  const apiSecret = generateTempPassword() + generateTempPassword();
  const adminPassword = generateTempPassword() + "!";

  const [uni] = await db
    .insert(universities)
    .values({
      name: request.universityName,
      nameEn: request.universityNameEn,
      code,
      country: request.country,
      city: request.city,
      website: request.website,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone,
      status: "approved",
      ssoType,
      googleDomain: ssoType === "google" ? googleDomain : null,
      apiKey,
      apiSecretHash: hashPassword(apiSecret),
      studentsCount: request.studentsCount,
    })
    .returning();

  await db.insert(universityAdmins).values({
    universityId: uni.id,
    name: request.contactName,
    email: adminEmail,
    passwordHash: hashPassword(adminPassword),
    role: "admin",
  });

  await db
    .update(joinRequests)
    .set({ status: "approved", reviewedAt: new Date() })
    .where(eq(joinRequests.id, requestId));

  await db.insert(syncLogs).values({
    universityId: uni.id,
    type: "manual",
    action: "تفعيل حساب الجامعة",
    recordsCount: 0,
    status: "success",
    message: "تم اعتماد الجامعة وإنشاء حساب المسؤول",
  });

  revalidatePath("/secure-admin");
  revalidatePath("/secure-admin/requests");
  revalidatePath("/secure-admin/universities");

  return { adminEmail, adminPassword, universityCode: code };
}

/* ---------------------------- Reject a join request ------------------------ */

export async function rejectJoinRequestAction(formData: FormData): Promise<void> {
  await requirePlatformAdmin();
  const requestId = str(formData.get("requestId"));
  const note = str(formData.get("note")) || null;
  if (!requestId) return;
  await db
    .update(joinRequests)
    .set({ status: "rejected", reviewNote: note, reviewedAt: new Date() })
    .where(eq(joinRequests.id, requestId));
  revalidatePath("/secure-admin");
  revalidatePath("/secure-admin/requests");
}

/* ------------------------ Suspend / activate university -------------------- */

export async function setUniversityStatusAction(formData: FormData): Promise<void> {
  await requirePlatformAdmin();
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));
  if (!id || !["approved", "suspended"].includes(status)) return;
  await db
    .update(universities)
    .set({ status: status as "approved" | "suspended" })
    .where(eq(universities.id, id));
  revalidatePath("/secure-admin/universities");
  revalidatePath("/secure-admin");
}
