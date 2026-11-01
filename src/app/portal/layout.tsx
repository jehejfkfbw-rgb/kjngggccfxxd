import type { ReactNode } from "react";
import { Bell, CalendarDays, LayoutGrid, ListChecks, NotebookText } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { DashShell, type NavItem } from "@/components/dash/shell";

export const dynamic = "force-dynamic";

const nav: NavItem[] = [
  { href: "/portal", label: "الرئيسية", icon: LayoutGrid, exact: true },
  { href: "/portal/courses", label: "موادي الدراسية", icon: NotebookText },
  { href: "/portal/schedule", label: "الجدول الأسبوعي", icon: CalendarDays },
  { href: "/portal/results", label: "النتائج والسجلات", icon: ListChecks },
  { href: "/portal/announcements", label: "الإعلانات", icon: Bell },
];

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const { user, university } = await requireStudent();

  return (
    <DashShell
      nav={nav}
      university={{ name: university.name, nameEn: university.nameEn, logoColor: university.logoColor, code: university.code }}
      userName={user.fullName}
      userMeta={`رقم جامعي ${user.studentNumber}`}
      roleLabel="بوابة الطالب · Academic Future"
    >
      {children}
    </DashShell>
  );
}
