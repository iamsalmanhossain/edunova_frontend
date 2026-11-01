"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const targetPath = authService.getRoleDashboardPath(user.role);
    router.replace(targetPath);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f7faf8] flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-2xl bg-[#0a4b32] text-white flex items-center justify-center shadow-lg mb-4">
        <Loader2 className="w-6 h-6 animate-spin text-[#c48b28]" />
      </div>
      <p className="text-sm font-bold text-[#0a4b32]">Directing to Authorized Portal...</p>
    </div>
  );
}

