"use client";

import React, { Suspense } from "react";
import AdminTeachersManager from "@/components/dashboard/admin/teachers/AdminTeachersManager";
import AdminTeachersSkeleton from "@/components/dashboard/skeletons/AdminTeachersSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminTeachersPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return (
    <Suspense fallback={<AdminTeachersSkeleton />}>
      <AdminTeachersManager user={user} />
    </Suspense>
  );
}
