"use client";

import React, { useState, useEffect } from "react";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import AdminDashboardSkeleton from "@/components/dashboard/skeletons/AdminDashboardSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function AdminDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (isLoggingOut) {
    return null;
  }

  if (!mounted || !user) {
    return <AdminDashboardSkeleton />;
  }

  return <AdminDashboard user={user} />;
}
