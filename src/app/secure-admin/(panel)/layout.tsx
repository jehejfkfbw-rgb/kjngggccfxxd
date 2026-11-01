import type { ReactNode } from "react";
import { Landmark, LayoutGrid, Inbox } from "lucide-react";
import { requirePlatformAdmin } from "@/lib/auth";
import { DashShell, type NavItem } from "@/components/dash/shell";

export const dynamic = "force-dynamic";

import { Users, ScrollText, Megaphone } from "lucide-react";

const nav: NavItem[] = [
  { href: "/secure-admin", label: "الرادار", icon: LayoutGrid, exact: true },
  { href: "/secure-admin/requests", label: "الطلبات", icon: Inbox },
  { href: "/secure-admin/universities", label: "الجامعات", icon: Landmark },
  { href: "/secure-admin/students", label: "كل الطلاب", icon: Users },
  { href: "/secure-admin/logs", label: "سجل العمليات", icon: ScrollText },
  { href: "/secure-admin/broadcast", label: "بث عام", icon: Megaphone },
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
