"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students } from "@/db/schema";
import { hashPassword, requireStudent, verifyPassword } from "@/lib/auth";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export type PasswordState = { error?: string; success?: string } | null;

export async function changePasswordAction(
  _prev: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const { user } = await requireStudent();
  const current = str(formData.get("current"));
  const next = str(formData.get("next"));
  const confirm = str(formData.get("confirm"));

  if (!current || !next || !confirm) return { error: "يرجى استكمال جميع الحقول." };
  if (next.length < 8) return { error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف." };
  if (next !== confirm) return { error: "تأكيد كلمة المرور غير متطابق." };
  if (!verifyPassword(current, user.passwordHash)) {
    return { error: "كلمة المرور الحالية غير صحيحة." };
  }

  await db
    .update(students)
    .set({ passwordHash: hashPassword(next), updatedAt: new Date() })
    .where(eq(students.id, user.id));

  return { success: "تم تحديث كلمة المرور بنجاح." };
}
