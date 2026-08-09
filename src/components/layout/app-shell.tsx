"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Topbar } from "./topbar";
import { Fab } from "@/components/shared/fab";

const NO_SHELL_ROUTES = ["/signin", "/signup", "/forgot-password"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_ROUTES.includes(pathname);

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 bg-white pt-4 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
      <BottomNav />
      <Fab />
    </div>
  );
}
