import type { ReactNode } from "react";
import { Landmark, LayoutGrid, Inbox } from "lucide-react";
import { requirePlatformAdmin } from "@/lib/auth";
import { DashShell, type NavItem } from "@/components/dash/shell";

export const dynamic = "force-dynamic";

const nav: NavItem[] = [
  { href: "/secure-admin", label: "نظرة عامة", icon: LayoutGrid, exact: true },
  { href: "/secure-admin/requests", label: "طلبات الانضمام", icon: Inbox },
  { href: "/secure-admin/universities", label: "الجامعات المشاركة", icon: Landmark },
];

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { user } = await requirePlatformAdmin();

  return (
    <DashShell
      nav={nav}
      university={null}
      isPlatformAdmin
      userName={user.name}
      userMeta={user.email}
      roleLabel="منطقة مقيدة · صلاحيات إدارة المنصة"
    >
      {children}
    </DashShell>
  );
}
