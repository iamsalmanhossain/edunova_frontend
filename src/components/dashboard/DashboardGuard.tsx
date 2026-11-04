"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import CentralBrandLoader from "@/components/shared/CentralBrandLoader";

interface DashboardGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<"STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN">;
}

export default function DashboardGuard({
  children,
  allowedRoles,
}: DashboardGuardProps) {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  useEffect(() => {
    setMounted(true);

    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const currentUser = storeUser || authService.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const role = currentUser.role?.toUpperCase() as
      | "STUDENT"
      | "TEACHER"
      | "ADMIN"
      | "SUPER_ADMIN";

    const isAllowed =
      allowedRoles.includes(role) ||
      (allowedRoles.includes("ADMIN") && role === "SUPER_ADMIN");

    if (!isAllowed) {
      const correctPath = authService.getRoleDashboardPath(role);
      router.push(correctPath);
    }
  }, [allowedRoles, router, storeUser]);

  // Initial SSR mount: render clean skeleton shell to avoid SSR/client hydration mismatch
  if (!mounted || !user) {
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

  const role = user.role?.toUpperCase() as
    | "STUDENT"
    | "TEACHER"
    | "ADMIN"
    | "SUPER_ADMIN";

  const isAllowed =
    allowedRoles.includes(role) ||
    (allowedRoles.includes("ADMIN") && role === "SUPER_ADMIN");

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f1f17]">Access Restricted</h2>
          <p className="text-xs text-[#5a6b62] mt-1.5 leading-relaxed">
            Your current role ({user.role}) does not have permission to access this specific portal dashboard.
          </p>
          <div className="mt-5 flex gap-2 justify-center">
            <Button
              onClick={() => router.push(authService.getRoleDashboardPath(user.role))}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs cursor-pointer"
            >
              Go to Your Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => authService.logout().then(() => router.push("/login"))}
              className="text-xs cursor-pointer"
            >
              Sign In with Other Role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
