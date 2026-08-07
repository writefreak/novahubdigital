import { LayoutGrid, NotebookPen, Wrench, FileText, Users } from "lucide-react";

export const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/log", label: "Daily Log", icon: NotebookPen },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/team", label: "Team", icon: Users },
];
