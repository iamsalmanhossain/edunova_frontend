"use client";

import React, { useEffect, useState } from "react";
import { useToastStore, ToastItem } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export default function GlobalToastContainer() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";
  const isWarning = toast.type === "warning";

  const borderColor = isSuccess
    ? "border-[#0a4b32]/20"
    : isError
    ? "border-rose-200"
    : isWarning
    ? "border-amber-200"
    : "border-sky-200";

  const iconColor = isSuccess
    ? "text-[#0a4b32]"
    : isError
    ? "text-rose-600"
    : isWarning
    ? "text-amber-600"
    : "text-sky-600";

  const iconBg = isSuccess
    ? "bg-emerald-50 text-[#0a4b32]"
    : isError
    ? "bg-rose-50 text-rose-600"
    : isWarning
    ? "bg-amber-50 text-amber-600"
    : "bg-sky-50 text-sky-600";

  return (
    <div
      role="alert"
      className={`pointer-events-auto bg-white rounded-2xl border ${borderColor} shadow-xl p-4 flex items-start gap-3.5 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in`}
    >
      <div className={`p-2 rounded-xl ${iconBg} shrink-0 mt-0.5`}>
        {isSuccess && <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />}
        {isError && <AlertCircle className={`w-5 h-5 ${iconColor}`} />}
        {isWarning && <AlertTriangle className={`w-5 h-5 ${iconColor}`} />}
        {!isSuccess && !isError && !isWarning && <Info className={`w-5 h-5 ${iconColor}`} />}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h4 className="text-xs font-bold text-gray-900 tracking-tight leading-snug">
            {toast.title}
          </h4>
        )}
        <p className="text-xs font-medium text-gray-700 leading-relaxed mt-0.5 break-words">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

