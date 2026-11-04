"use client";

import React, { useState, useEffect } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#f4f7f5] flex select-none" suppressHydrationWarning>
        <aside className="hidden lg:flex w-64 xl:w-72 bg-[#073825] h-full shrink-0 border-r border-[#0a4b32]" />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <header className="h-16 shrink-0 bg-white border-b border-[#e2e8e4]" />
          <main className="flex-1 overflow-y-auto bg-[#f4f7f5] p-3 sm:p-5 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      <DashboardLayout user={user} role="TEACHER">
        {children}
      </DashboardLayout>
    </DashboardGuard>
  );
}

