"use client";

import React, { Suspense } from "react";
import AdminInstitutesManager from "@/components/dashboard/admin/institutes/AdminInstitutesManager";
import AdminInstitutesSkeleton from "@/components/dashboard/skeletons/AdminInstitutesSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminInstitutesPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return (
    <Suspense fallback={<AdminInstitutesSkeleton />}>
      <AdminInstitutesManager user={user} />
    </Suspense>
  );
}

