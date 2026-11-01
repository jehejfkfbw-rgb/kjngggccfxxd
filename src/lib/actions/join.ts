"use server";

import { db } from "@/db";
import { joinRequests, type JoinDocument } from "@/db/schema";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export type JoinState = { error?: string; success?: boolean } | null;

export async function submitJoinRequestAction(
  _prev: JoinState,
  formData: FormData
): Promise<JoinState> {
  const universityName = str(formData.get("universityName"));
  const universityNameEn = str(formData.get("universityNameEn")) || null;
  const country = str(formData.get("country"));
  const city = str(formData.get("city")) || null;
  const website = str(formData.get("website")) || null;
  const contactName = str(formData.get("contactName"));
  const contactEmail = str(formData.get("contactEmail")).toLowerCase();
  const contactPhone = str(formData.get("contactPhone")) || null;
  const studentsCount = parseInt(str(formData.get("studentsCount"))) || null;
  const ssoType = str(formData.get("ssoType")) === "google" ? "google" : "password";
  const googleDomain = str(formData.get("googleDomain")) || null;
  const message = str(formData.get("message")) || null;

  let documents: JoinDocument[] = [];
  try {
    documents = JSON.parse(str(formData.get("documents")) || "[]") as JoinDocument[];
  } catch {
    documents = [];
  }

  if (!universityName || !country || !contactName || !contactEmail) {
    return { error: "يرجى استكمال جميع الحقول المطلوبة." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "البريد الإلكتروني الرسمي غير صالح." };
  }
  if (ssoType === "google" && !googleDomain) {
    return { error: "يرجى إدخال نطاق Google Workspace المعتمد لجامعتكم." };
  }
  if (documents.length === 0) {
    return { error: "يرجى إرفاق المستندات الرسمية المطلوبة للتحقق." };
  }

  await db.insert(joinRequests).values({
    universityName,
    universityNameEn,
    country,
    city,
    website,
    contactName,
    contactEmail,
    contactPhone,
    studentsCount,
    ssoType,
    googleDomain,
    message,
    documents: documents.slice(0, 8),
  });

  return { success: true };
}
