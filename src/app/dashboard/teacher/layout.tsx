"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CentralBrandLoader from "@/components/shared/CentralBrandLoader";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
    if (!currentUser && !isLoggingOut) {
      router.replace("/login");
    }
  }, [storeUser, isLoggingOut, router]);

  if (!mounted) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#f4f7f5] flex select-none" suppressHydrationWarning>
        <aside className="hidden lg:flex w-64 xl:w-72 bg-[#073825] h-full shrink-0 border-r border-[#0a4b32]" />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <header className="h-16 shrink-0 bg-white border-b border-[#e2e8e4]" />
          <main className="flex-1 overflow-y-auto bg-[#f4f7f5] p-3 sm:p-5 lg:p-6" />
        </div>
      </div>
    );
  }

  if (isLoggingOut || !user) {
    return (
      <CentralBrandLoader
        message={isLoggingOut ? "Signing out safely..." : "Redirecting to Login..."}
        subMessage={isLoggingOut ? "Clearing active session and securing credentials..." : "Please sign in to access the faculty portal."}
        fullScreen={true}
      />
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

