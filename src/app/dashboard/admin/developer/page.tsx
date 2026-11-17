"use client";

import React from "react";
import AdminDeveloperManager from "@/components/dashboard/admin/developer/AdminDeveloperManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminDeveloperPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user =
    storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminDeveloperManager user={user} />;
}
