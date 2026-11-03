"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

export default function GenericProfileRedirectPage() {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "TEACHER") {
      router.replace("/dashboard/teacher/profile");
    } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      router.replace("/dashboard/admin/profile");
    } else {
      router.replace("/dashboard/student/profile");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]" suppressHydrationWarning>
      <div className="flex flex-col items-center gap-2" suppressHydrationWarning>
        <Loader2 className="w-8 h-8 animate-spin text-[#0a4b32]" />
        <p className="text-xs text-[#5a6b62]">Loading profile portal...</p>
      </div>
    </div>
  );
}
