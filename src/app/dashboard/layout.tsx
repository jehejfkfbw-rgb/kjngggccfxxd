import type { ReactNode } from "react";
import { Bell, BookOpenCheck, FileSpreadsheet, GitBranch, LayoutGrid, Users } from "lucide-react";
import { requireUniversityAdmin } from "@/lib/auth";
import { DashShell, type NavItem } from "@/components/dash/shell";

export const dynamic = "force-dynamic";

const nav: NavItem[] = [
  { href: "/dashboard", label: "لوحة القيادة", icon: LayoutGrid, exact: true },
  { href: "/dashboard/students", label: "إدارة الطلاب", icon: Users },
  { href: "/dashboard/academics", label: "الكليات والأقسام", icon: BookOpenCheck },
  { href: "/dashboard/courses", label: "المواد الدراسية", icon: GitBranch },
  { href: "/dashboard/announcements", label: "الإعلانات", icon: Bell },
  { href: "/dashboard/import", label: "استيراد البيانات", icon: FileSpreadsheet },
  { href: "/dashboard/integrations", label: "الربط البرمجي API", icon: GitBranch },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, university } = await requireUniversityAdmin();

  return (
    <DashShell
      nav={nav}
      university={{ name: university.name, nameEn: university.nameEn, logoColor: university.logoColor, code: university.code }}
      userName={user.name}
      userMeta={user.email}
      roleLabel="بوابة الجامعات · Academic Future"
    >
      {children}
    </DashShell>
  );
}
