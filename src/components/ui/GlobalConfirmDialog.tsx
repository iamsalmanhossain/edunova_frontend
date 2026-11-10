"use client";

import React, { useEffect, useState } from "react";
import { useConfirmStore } from "@/store/useConfirmStore";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

export default function GlobalConfirmDialog() {
  const [mounted, setMounted] = useState(false);
  const { isOpen, isLoading, options, closeConfirm } = useConfirmStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        options?.onCancel?.();
        closeConfirm();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, options, closeConfirm]);

  if (!mounted || !isOpen || !options) return null;

  const variant = options.variant || "default";

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "warning":
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case "destructive":
        return "bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus-visible:ring-amber-500";
      default:
        return "bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs focus-visible:ring-[#0a4b32]";
    }
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    if (options.onConfirm) {
      await options.onConfirm();
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    if (options.onCancel) {
      options.onCancel();
    }
    closeConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          handleCancel();
        }
      }}
    >
      <div className="bg-white rounded-3xl border border-[#dce3df] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {getIcon()}
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0f1f17] leading-snug">
                {options.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed mt-1">
                {options.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-7 h-7 rounded-xl text-[#5a6b62] hover:text-[#0f1f17] hover:bg-[#f0f4f1] flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-10 px-4 text-xs font-bold border-[#dce3df] text-[#5a6b62] hover:text-[#0f1f17] hover:bg-[#f0f4f1] rounded-xl transition-colors cursor-pointer"
          >
            {options.cancelText || "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`h-10 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${getConfirmButtonClasses()}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {variant === "default" && <CheckCircle2 className="w-4 h-4" />}
                <span>{options.confirmText || "Confirm"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

