"use client";

import React from "react";
import { Users, UserCheck, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface AdminMetricsProps {
  totalStudents?: string;
  totalFaculty?: string;
  departmentCount?: number;
  pendingApprovalsCount?: number;
}

export default function AdminMetricsGrid({
  totalStudents = "1,250+",
  totalFaculty = "48+",
  departmentCount = 4,
  pendingApprovalsCount = 1,
}: AdminMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Total Students */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Enrolled Students</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{totalStudents}</h3>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Across 7 Semesters
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Faculty Count */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Faculty &amp; Staff</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{totalFaculty}</h3>
            <p className="text-[11px] text-[#5a6b62] mt-1">Instructors &amp; Officers</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#c48b28]/15 text-[#c48b28] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Academic Departments</p>
            <h3 className="text-2xl font-black text-[#0a4b32] mt-1">{departmentCount} Disciplines</h3>
            <p className="text-[11px] text-[#5a6b62] mt-1">Dual Shift Structure</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5a6b62]">Pending Approvals</p>
            <h3 className="text-2xl font-black text-[#c48b28] mt-1">{pendingApprovalsCount}</h3>
            <p className="text-[11px] text-[#c48b28] font-medium mt-1">
              {pendingApprovalsCount > 0 ? "Requires Authorization" : "All Approved"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#c48b28]/15 text-[#c48b28] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

