"use client";

import React from "react";
import { UserCheck, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PendingFacultyItem {
  id: string;
  name: string;
  email: string;
  designation: string;
  qualification: string;
  department: string;
  shift: string;
  phone: string;
}

interface AdminFacultyApprovalsProps {
  teachers: PendingFacultyItem[];
  approvedIds: Record<string, boolean>;
  onApprove: (id: string) => void;
}

export default function AdminFacultyApprovals({
  teachers,
  approvedIds,
  onApprove,
}: AdminFacultyApprovalsProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#0f1f17]">
            Faculty Registration Approvals
          </CardTitle>
          <p className="text-xs text-[#5a6b62] mt-0.5">
            Verify teacher credentials before assigning official polytechnic mark sheets and classes
          </p>
        </div>
        <Badge className="bg-[#c48b28] text-white hover:bg-[#b07b22]">
          Action Required
        </Badge>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 divide-y divide-[#e2e8e4]">
        {teachers.map((teacher) => {
          const isApproved = approvedIds[teacher.id];
          return (
            <div
              key={teacher.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0f1f17]">
                    {teacher.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#f0f7f3] text-[#0a4b32] font-semibold">
                    {teacher.designation}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#5a6b62]">
                    {teacher.shift}
                  </span>
                </div>
                <p className="text-xs text-[#5a6b62]">
                  Email: <span className="font-medium text-[#0f1f17]">{teacher.email}</span> • Phone: {teacher.phone}
                </p>
                <p className="text-xs text-[#5a6b62]">
                  Qualification: <span className="text-[#0f1f17]">{teacher.qualification}</span> • Department: {teacher.department}
                </p>
              </div>

              <div>
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    Approved &amp; Activated
                  </span>
                ) : (
                  <Button
                    onClick={() => onApprove(teacher.id)}
                    className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs h-9 shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                    Approve Instructor
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

