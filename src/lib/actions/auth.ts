"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  platformAdmins,
  students,
  universities,
  universityAdmins,
} from "@/db/schema";
import {
  checkRateLimit,
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error?: string } | null;

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/* ------------------------------- Student login ----------------------------- */

export async function studentLoginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const code = str(formData.get("universityCode")).toUpperCase();
  const studentNumber = str(formData.get("studentNumber"));
  const password = str(formData.get("password"));

  if (!code || !studentNumber || !password) {
    return { error: "يرجى إدخال كود الجامعة والرقم الجامعي وكلمة المرور." };
  }

  if (!checkRateLimit(`student:${code}:${studentNumber}`)) {
    return { error: "عدد كبير من المحاولات. يرجى المحاولة بعد 10 دقائق." };
  }

  const [uni] = await db.select().from(universities).where(eq(universities.code, code)).limit(1);
  if (!uni || uni.status === "rejected") {
    // Delay uniform response to avoid enumeration
    return { error: "بيانات الدخول غير صحيحة أو الجامعة غير مشاركة في المنصة." };
  }
  if (uni.status === "pending") {
    return { error: "جامعتك قيد المراجعة من إدارة المنصة ولم يتم تفعيلها بعد." };
  }
  if (uni.status === "suspended") {
    return { error: "تم إيقاف حساب الجامعة مؤقتاً. يرجى التواصل مع الدعم الفني." };
  }

  const [student] = await db
    .select()
    .from(students)
    .where(and(eq(students.universityId, uni.id), eq(students.studentNumber, studentNumber)))
    .limit(1);

  if (!student || !verifyPassword(password, student.passwordHash)) {
    return { error: "الرقم الجامعي أو كلمة المرور غير صحيحة." };
  }
  if (student.status === "suspended") {
    return { error: "تم إيقاف هذا الحساب. يرجى مراجعة شؤون الطلاب بجامعتك." };
  }

  await createSession("student", student.id, uni.id);
  redirect("/portal");
}

/* ------------------------- Google Workspace SSO ---------------------------- */

export async function googleSsoAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const code = str(formData.get("universityCode")).toUpperCase();
  const email = str(formData.get("email")).toLowerCase();

  if (!code || !email) return { error: "يرجى إدخال كود الجامعة والبريد الجامعي." };
  if (!checkRateLimit(`sso:${code}:${email}`)) {
    return { error: "عدد كبير من المحاولات. يرجى المحاولة لاحقاً." };
  }

  const [uni] = await db.select().from(universities).where(eq(universities.code, code)).limit(1);
  if (!uni || uni.status !== "approved") {
    return { error: "الجامعة غير مشاركة في المنصة أو لم يتم تفعيلها بعد." };
  }
  if (uni.ssoType !== "google" || !uni.googleDomain) {
    return { error: "هذه الجامعة لا تستخدم الدخول عبر Google Workspace." };
  }

  const domain = email.split("@")[1] ?? "";
  if (domain !== uni.googleDomain.toLowerCase()) {
    return { error: `يجب استخدام البريد الجامعي الرسمي (@${uni.googleDomain}).` };
  }

  const [student] = await db
    .select()
    .from(students)
    .where(and(eq(students.universityId, uni.id), eq(students.email, email)))
    .limit(1);

  if (!student) {
    return { error: "هذا البريد غير مسجل في بيانات الجامعة على المنصة." };
  }
  if (student.status === "suspended") {
    return { error: "تم إيقاف هذا الحساب. يرجى مراجعة شؤون الطلاب بجامعتك." };
  }

  await createSession("student", student.id, uni.id);
  redirect("/portal");
}

/* ----------------------------- University login ---------------------------- */

export async function universityLoginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData.get("email")).toLowerCase();
  const password = str(formData.get("password"));

  if (!email || !password) return { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." };
  if (!checkRateLimit(`uni:${email}`)) {
    return { error: "عدد كبير من المحاولات. يرجى المحاولة بعد 10 دقائق." };
  }

  const [admin] = await db
    .select()
    .from(universityAdmins)
    .where(eq(universityAdmins.email, email))
    .limit(1);

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  const [uni] = await db.select().from(universities).where(eq(universities.id, admin.universityId)).limit(1);
  if (!uni) return { error: "حساب الجامعة غير موجود." };
  if (uni.status === "suspended") {
    return { error: "تم إيقاف حساب الجامعة مؤقتاً. يرجى التواصل مع إدارة المنصة." };
  }
  if (uni.status !== "approved") {
    return { error: "حساب الجامعة لم يتم تفعيله بعد." };
  }

  await createSession("university_admin", admin.id, uni.id);
  redirect("/dashboard");
}

/* ------------------------------- Admin login ------------------------------- */

export async function adminLoginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = str(formData.get("email")).toLowerCase();
  const password = str(formData.get("password"));

  if (!email || !password) return { error: "يرجى إدخال بيانات الدخول." };
  if (!checkRateLimit(`admin:${email}`, 5)) {
    return { error: "تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً." };
  }

  const [admin] = await db
    .select()
    .from(platformAdmins)
    .where(eq(platformAdmins.email, email))
    .limit(1);

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "بيانات الدخول غير صحيحة." };
  }

  await createSession("platform_admin", admin.id, null);
  redirect("/secure-admin");
}

/* --------------------------------- Logout ---------------------------------- */

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
