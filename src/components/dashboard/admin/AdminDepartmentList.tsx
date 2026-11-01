"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DepartmentSummaryItem {
  name: string;
  code: string;
  students: number;
  faculty: number;
  head: string;
}

interface AdminDepartmentListProps {
  departments: DepartmentSummaryItem[];
}

export default function AdminDepartmentList({ departments }: AdminDepartmentListProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#e2e8e4]/80">
        <CardTitle className="text-base font-bold text-[#0f1f17]">
          Kishoreganj Polytechnic Departments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 divide-y divide-[#e2e8e4]">
        {departments.map((dept) => (
          <div key={dept.code} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#0f1f17]">{dept.name}</p>
              <p className="text-[#5a6b62] text-[11px] mt-0.5">Head: {dept.head}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0a4b32]">{dept.students} Students</p>
              <p className="text-[#5a6b62] text-[11px]">{dept.faculty} Faculty</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

