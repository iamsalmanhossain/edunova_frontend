"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Users, FileSpreadsheet, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherQuickTools() {
  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-[#fbfcfb]">
      <CardHeader className="pb-2 border-b border-[#e2e8e4]/60">
        <CardTitle className="text-sm font-bold text-[#0f1f17]">
          Faculty Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Link href="/dashboard/teacher/attendance" className="block">
          <Button
            variant="outline"
            className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 mr-2 text-[#0a4b32]" />
            Take Daily Attendance
          </Button>
        </Link>
        <Link href="/dashboard/teacher/results" className="block">
          <Button
            variant="outline"
            className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
          >
            <Award className="w-4 h-4 mr-2 text-[#c48b28]" />
            Manage Marks & Results
          </Button>
        </Link>
        <Link href="/dashboard/teacher/students" className="block">
          <Button
            variant="outline"
            className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
          >
            <Users className="w-4 h-4 mr-2 text-[#0a4b32]" />
            Student Roll Sheet Directory
          </Button>
        </Link>
        <Link href="/dashboard/teacher/attendance" className="block">
          <Button
            variant="outline"
            className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-[#0a4b32]" />
            Pre-Enroll New Students
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
