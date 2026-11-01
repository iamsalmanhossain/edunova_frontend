"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TeacherApprovalAlertProps {
  status?: string;
  instituteName?: string;
}

export default function TeacherApprovalAlert({
  status = "PENDING",
  instituteName = "Kishoreganj Polytechnic Institute",
}: TeacherApprovalAlertProps) {
  if (status !== "PENDING") return null;

  return (
    <Alert className="bg-amber-50 border-amber-300 text-amber-900 shadow-xs">
      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="ml-2">
        <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Departmental Verification Status: Pending Administrative Approval
        </AlertTitle>
        <AlertDescription className="text-xs text-amber-800/90 mt-1 leading-relaxed">
          Your instructor credentials for {instituteName} are active in the system. Full course mark submission permissions will be granted upon Principal or HOD authorization.
        </AlertDescription>
      </div>
    </Alert>
  );
}

