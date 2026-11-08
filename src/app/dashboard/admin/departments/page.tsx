"use client";

import React, { useState, useEffect } from "react";
import AdminDepartmentsManager from "@/components/dashboard/admin/departments/AdminDepartmentsManager";
import AdminDepartmentsSkeleton from "@/components/dashboard/skeletons/AdminDepartmentsSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function AdminDepartmentsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <AdminDepartmentsSkeleton />;
  }

  return <AdminDepartmentsManager user={user} />;
}
