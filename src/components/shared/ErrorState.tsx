import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Failed to load information",
  message = "An error occurred while connecting to the service. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-2xl border border-red-200 bg-red-50/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-1 text-sm text-red-700 max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 border-red-300 text-red-800 hover:bg-red-100/60"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Request
        </Button>
      )}
    </div>
  );
}

