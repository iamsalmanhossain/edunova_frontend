"use client";

import React, { Suspense } from "react";
import AdminStudentsManager from "@/components/dashboard/admin/students/AdminStudentsManager";
import AdminStudentsSkeleton from "@/components/dashboard/skeletons/AdminStudentsSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminStudentsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return (
    <Suspense fallback={<AdminStudentsSkeleton />}>
      <AdminStudentsManager user={user} />
    </Suspense>
  );
}
