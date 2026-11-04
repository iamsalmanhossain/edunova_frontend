"use client";

import React from "react";
import AdminProfile from "@/components/dashboard/admin/profile/Profile";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function AdminProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <AdminProfile initialUser={user} />;
}
